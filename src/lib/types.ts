export type RegisterDataType = {
  name: string
  surname: string
  email: string
  phoneNumber: string
  password: string
  password_confirmation: string
  otpCode: string[]
  explicitConsent:boolean
  acceptEmail:boolean
  clarificationText:boolean
}
export type FilterOptions = {
  brands: any[]
  subBrands: any[]
  currencies: any[]
  unitTypes: any[]
  weightTypes: any[]
  cat1: any[]
  cat2: any[]
  cat3: any[]
  countries: any[]
  packageTypes: any[]
}
export type LoginDataType = {
  email?: string
  phone?: string
  password: string
}

export type ForgotPasswordDataType = {
  email: string
}

export type ResetPasswordDataType = {
  password: string
  confirmPassword: string
  token: string
  email: string
}

export type ChartDataType = {
  title: string
  totalAmount: number
  data: ChartSalesDataType[]
  description: string
  weeks: string[]
}

export type ChartSalesDataType = {
  name: string
  data: number[]
}

export type NotificationType = {
  title: string
  content: string
  notificationType: string
}

export type MynetNewsType = {
  title: string
  imageUrl: string
  linkUrl: string
}

export type ProductFilterOptionsType = {
  firms: { value: number; label: string }[]
  brands: { value: number; label: string }[]
  subBrands: { value: number; label: string }[]
  countries: { value: string; label: string }[]
  currencies: { value: string; label: string }[]
  unitTypes: { value: number; label: string }[]
  cat1: { value: string; label: string }[]
  cat2: { value: string; label: string }[]
  cat3: { value: string; label: string }[]
  weightTypes: { value: number; label: string }[]
}

export type DropdownItem<T> = {
  value: T
  label: string
}

export type NewProductType = {
  barcode: string
  brandId: number | null
  buyingPrice: number
  cat1: string
  cat2?: string
  cat3?: string
  criticalStock: number
  currencyId: string
  firmId: number
  name: string
  packageTypeId: number
  sellingPrice: number
  packageUnit: number
  stock: number
  subBrandId: number | null
  tax: number
  unitTypeId: number
  weight: number
  weightTypeId: number
}

export type CurrentAccountTableType = {
  customerId: number
  title: string
  searchKey: string
  customerPhone: string
  customerFullName: string
  mail: string
  customerType: string
  balanceLimit: number
  city: string
  district: string
  createdAt: string
}

export type CurrentAccountType = {
  title: string
  customerPhone: string
  customerFullName: string
  mail: string
  customerId: number
  customerType: string
  customerTypeId: number
  balanceLimit: number
  cityId: number
  districtId: number
  createdAt: string
  branchId: number
}

export type CustomerTransactionHistoryTableType = {
  Id: number
  description: string
  salesTransactionId: number
  deptPay: number
  debt: number
  date: string
  transactionType: string
}

export type TransactionReceiptType = {
  name: string
  barcode: string
  quantity: number
  unityPrice: number
  tax: number
  salesDate: string
}

export type CustomerTransactionHistoryType = {
  transactionType: string
  description: string
  salesTransactionId: number
  amount: number
  date: string
  branchId: number
  customerId: number
  transactionTypeId: number
  paymentTypeId: number
}

export type CurrentAccountBySalesType = {
  currencyId: string
  customerId: number
  discountTotalAmount: number
  items: CurrentAccountBySalesItemType[]
  paymentTypeId: number
  totalAmount: number
  totalQuantity: number
}

export type CurrentAccountBySalesItemType = {
  barcode: string
  quantity: number
  sellingPrice: number
  tax: number
}

export interface ModalProps {
  className?: string
  name?: string
  message?: string
  onClose: () => void
  onSave?: () => void
  children?: React.ReactNode
  firstButtonName?: string
  secondButtonName?: string
  id: string
  handleSubmit?: (onSubmit: (e: React.FormEvent) => void) => void
}

export type UserInfoType = {
  id: string
  name: string
  surname: string
  role: string
  email: string
  phoneNumber: string
  storeName: string
  branchId: number
  companyId: number
}

export type WeatherType = {
  temperature: number
  weatherCondition: string
}

export type ContactSupportDataType = {
  firstname: string
  lastname: string
  email: string
  message: string
}

export type ProductType = {
  imageUrl: string
  barcode: string
  name: string
  stock: number
  criticalStock: number
  skuCode: string
  buyingPrice: number
  sellingPrice: number
  cat1: string
  cat2: string
  cat3: string
  firm: string
  brand: string
  subBrand: string
  country: string
  currency: string
  unitType: string
  origin: string
  weightType: string
  weight: number
  tax: number
  quantity: number
}

export type BranchProfileDataType = {
  branchName: string
  branchInvoiceName: string
  branchOwnerFirstName: string
  branchOwnerLastName: string
  branchOwnerPhoneNumber: string
  branchOwnerEmail: string
  currency: string
  country: string
  city: string
  district: string
  address: string
  printerId: number
  id: number
}

export type AccountType = {
  userId: string
  branchId: number
  companyId: number
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  identityNumber: string
  phoneNumber: string
  emergencyName: string
  emergencyPhoneNumber: string
  iban: string
  responsibility: string
  address: string
  bloodType: string
  other: string
  role: string | undefined
  roles: string[];
  permissions:PermissionModalType
  // active: boolean
  // viewCurrentAccount: boolean
  // addProduct: boolean
  // deleteProduct: boolean
  // manageCompany: boolean
  // incomeExpenses: boolean
  // purchaseInvoices: boolean
  // salesDiscount: boolean
}

export type UserInfo = {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    surname: string
    role: string
    email: string
    phoneNumber: string
    storeName: string
    companyId: number
    branchId: number
  }
}
export type PageData = {
  name: string;
  barcode: string;
  branchId: number;
  quickSaleHeaderId: number;
  id:number,
}

export type PermissionModalType = {
  sales:boolean;
  sales_report:boolean;
  stock_report:boolean;
  update_product:boolean;
  create_product:boolean;
  cari:boolean;
}