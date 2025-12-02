"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Convert Prisma Decimal fields to numbers for safe JSON usage.
 */
const serializeTransaction = (obj) => {
  if (!obj) return obj;
  const serialized = { ...obj };
  if (obj.balance != null && typeof obj.balance.toNumber === "function") {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount != null && typeof obj.amount.toNumber === "function") {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: { id: accountId },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeTransaction(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAccountWithTransactions(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      console.error("3. User DB Error: No user in our DB for this Clerk ID.");
      throw new Error("User not found");
    }

    // Use findFirst so you can filter by both id and userId reliably
    const account = await db.account.findFirst({
      where: { id: accountId, userId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!account) {
      console.error("4. Account DB Error: No account found for this ID and user.");
      return null;
    }

    // Normalize transactions to an array and serialize decimals
    const transactionsArray = Array.isArray(account.transactions)
      ? account.transactions.map(serializeTransaction)
      : [];

    return {
      ...serializeTransaction(account),
      transactions: transactionsArray,
    };
  } catch (error) {
    console.error("getAccountWithTransactions error:", error);
    return null;
  }
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    // Group transactions by account to update balances
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      // Normalize Decimal to number (if Decimal)
      const amt =
        transaction.amount != null && typeof transaction.amount.toNumber === "function"
          ? transaction.amount.toNumber()
          : Number(transaction.amount) || 0;

      const change = transaction.type === "EXPENSE" ? amt : -amt;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    // Delete transactions and update account balances in a transaction
    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
