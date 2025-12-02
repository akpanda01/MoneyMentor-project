import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { BudgetProgress } from "./_components/budget-progress";
import AccountCard from "./_components/account-card";
import CreateAccountDrawer from "@/components/create-account-drawer";
import DashboardOverview from "./_components/transaction-overview";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  // fetch data in parallel
  const [accountsRaw, transactionsRaw] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  // normalize data to arrays so .map won't blow up
  const accounts = Array.isArray(accountsRaw) ? accountsRaw : [];
  const transactions = Array.isArray(transactionsRaw) ? transactionsRaw : [];

  // find default account safely
  const defaultAccount = accounts.find((account) => account?.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount?.id) {
    try {
      budgetData = await getCurrentBudget(defaultAccount.id);
    } catch (err) {
      // handle errors gracefully
      console.error("Failed to fetch budget for default account:", err);
      budgetData = null;
    }
  }

  // Runtime checks - helpful while debugging imports/exports
  if (typeof AccountCard === "undefined") {
    console.warn("AccountCard is undefined — check its export/import (default vs named).");
  }
  if (typeof CreateAccountDrawer === "undefined") {
    console.warn("CreateAccountDrawer is undefined — check its export/import.");
  }
  if (typeof DashboardOverview === "undefined") {
    console.warn("DashboardOverview is undefined — check its export/import.");
  }

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Dashboard Overview */}
      {typeof DashboardOverview !== "undefined" ? (
        <DashboardOverview accounts={accounts} transactions={transactions} />
      ) : (
        <div>
          <Card>
            <CardContent>
              <h3 className="text-sm font-medium">Overview</h3>
              <p className="text-sm text-muted-foreground">
                Overview component missing — check import/export.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Create account area — fallback if drawer component missing */}
        {typeof CreateAccountDrawer !== "undefined" ? (
          <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                <Plus className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
        ) : (
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
              <p className="text-xs text-red-500 mt-2">CreateAccountDrawer missing</p>
            </CardContent>
          </Card>
        )}

        {/* render account cards; safe fallback if AccountCard import is undefined */}
        {accounts.length > 0 ? (
          accounts.map((account) =>
            typeof AccountCard !== "undefined" ? (
              <AccountCard key={account.id} account={account} />
            ) : (
              <Card key={account.id}>
                <CardContent>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{Number(account.balance ?? 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            )
          )
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent>
                <p className="text-sm text-muted-foreground">No accounts found.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
