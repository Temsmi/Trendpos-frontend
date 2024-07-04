import http from '@/lib/http'
import { CurrentAccountBySalesType, CurrentAccountType, CustomerTransactionHistoryType } from '@/lib/types'

class CurrentAccountService {
  async getCustomerById(customerId: number) {
    const response = await http.get<{ data: CurrentAccountType }>(`/customer/${customerId}`)
    return response
  }

  async getFilterOptionByCity() {
    const response = await http.get('/city/filter-options')
    return response
  }

  async getSearchQueryByInputs(searchQuery: string) {
    const response = await http.get(`/customer/?searchQuery=${searchQuery}`)
    return response
  }

  async getFilterOptionByDistrict(cityId: number) {
    const response = await http.get(`/district/filter-options?cityId=${cityId}`)
    return response
  }

  async getFilterOptionByCustomerType() {
    const response = await http.get('/customer-type/filter-options')
    return response
  }

  async postSalesByAccountId(data: CurrentAccountBySalesType) {
    const response = await http.post(`/sales`, data)
    return response
  }

  async postCurrentAccount(data: CurrentAccountType) {
    const response = await http.post('/customer', data)
    return response
  }

  async putCurrentAccount(customerId: number, data: CurrentAccountType) {
    const response = await http.put(`/customer/${customerId}`, data)
    return response
  }

  async deleteCurrentAccountByCustomerId(id: number) {
    return http.delete(`/customer/${id}`)
  }

  async getCustomerTransactionHistoryByCustomerId(customerId: number) {
    const response = await http.get(`/customer/transaction/?customerId=${customerId}`)
    return response
  }

  async postCustomerTransactionHistory(data: CustomerTransactionHistoryType) {
    const response = await http.post('/customer/transaction/', data)
    return response
  }

  async putCustomerTransactionHistory(id: number, data: CustomerTransactionHistoryType) {
    const response = await http.put(`/customer/transaction/${id}`, data)
    return response
  }

  async deleteCustomerTransactionHistory(id: number) {
    return http.delete(`/customer/transaction/${id}`)
  }

  async getFilterOptionPaymentType() {
    const response = await http.get('/customer-payment-type/filter-options')
    return response
  }

  async getFilterOptionTransactionType() {
    const response = await http.get('/customer-transaction-type/filter-options')
    return response
  }

  async getCustomerTransactionHistoryByTransactionId(transactionId: number) {
    const response = await http.get(`/customer/transaction/${transactionId}`)
    return response
  }

  async putCustomerTransactionHistoryByTransactionId(data: CustomerTransactionHistoryType) {
    const response = await http.put('/customer/transaction/', data)
    return response
  }

  async getReceiptDetailByTransactionId(transactionId: number, branchId: number) {
    const response = await http.get(`/sales/${transactionId}?branchId=${branchId}`)
    return response
  }

  async getKvkkContent(){
    const response = await http.get('/auth/kvkk-content')
    return response
  }
}

export default new CurrentAccountService()