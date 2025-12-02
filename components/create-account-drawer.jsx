"use client"

import React, { useEffect, useState } from 'react'
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from './ui/drawer'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { accountSchema } from '@/lib/schema'
import { Input } from './ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import useFetch from '@/hooks/use-fetch'
import { createAccount } from '@/actions/dashboard'
import { Loader2 } from 'lucide-react'
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {data:newAccount ,error,fn: executeCreateAccount,loading:createAccountLoading} = useFetch(createAccount)

  useEffect(() => {
    if (newAccount && !createAccountLoading) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [createAccountLoading, newAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  const onSubmit = async (data) => {
    await executeCreateAccount(data);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          {/* --- Style Change: Title color --- */}
          <DrawerTitle className="text-blue-900">
            Create New Account
          </DrawerTitle>
        </DrawerHeader>
        <div className='px-4 pb-4'>
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>
              <label htmlFor='name' className='text-sm font-medium'>
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g. Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Set as Default
              </label>
              <p className="text-sm text-muted-foreground"> {/* Added for better text color */}
                This account will be selected by default for transactions
              </p>
              <Switch
                id="isDefault"
                // --- Style Change: Switch color ---
                className="data-[state=checked]:bg-blue-700"
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}
              />
            </div>

            <div>
              <DrawerClose asChild>
                <Button type="button" variant="outline" className='w-full mt-4'>
                  Cancel
                </Button>
              </DrawerClose>
              {/* --- Style Change: Button color --- */}
              <Button 
                type="submit" 
                className="w-full mt-4 bg-blue-700 hover:bg-blue-800"
                disabled={createAccountLoading}
              >
                { createAccountLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin'/>"Creating..." </> : "Create Account" }
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateAccountDrawer;