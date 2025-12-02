import { getAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
import {TransactionTable} from "../_components/transaction-table";
import { AccountChart } from "../_components/account-chart";

const AccountsPage = async ({ params }) => {
  const resolvedParams = await params;
  const accountData = await getAccountWithTransactions(resolvedParams.id);

  if (!accountData) {
    notFound();
  }

  const transactions = Array.isArray(accountData.transactions) ? accountData.transactions : [];
  const { transactions: _tx, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold text-blue-900 gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type?.charAt(0) + account.type?.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ₹{Number(account.balance ?? 0).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count?.transactions ?? 0} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense fallback={<BarLoader className="mt-4" width="100%" color="#9333ea" />}>
      <AccountChart transactions={transactions} />
      </Suspense>

        {/* Transaction Table */}
        <Suspense fallback={<BarLoader className="mt-4" width="100%" color="#9333ea" />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default AccountsPage;
