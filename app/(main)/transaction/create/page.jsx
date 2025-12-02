import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      {/* Title */}
      <div className="flex justify-center md:justify-start mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-blue-900 text-transparent bg-clip-text drop-shadow-sm">
          {editId ? "Edit Transaction" : "Add Transaction"}
        </h1>
      </div>

      {/* Card wrapper */}
      <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 transition-all">
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}