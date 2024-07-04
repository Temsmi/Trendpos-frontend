import http from "@/lib/http"

class BranchProfileService {
  async getBranch() {
    const response = await http.get('/branch')
    return response
  }
  async getPrinterFilterOption() {
    const response = await http.get('/branch/printer/filter-options')
    return response
  }
  async getCurrencyFilterOption() {
    const response = await http.get('/currency/filter-options')
    return response
  }
  async putBranch(data:any){
    const response = await http.put('/branch', data)
    return response
  }
}

export default new BranchProfileService()