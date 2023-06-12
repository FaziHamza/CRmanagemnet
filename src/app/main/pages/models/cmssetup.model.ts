export class CMSSetupModel{
  allowedReschedulingRequestsLimit: number;
  allowedTransferringRequestsLimit:number;
  constructor(data:any){
    this.allowedTransferringRequestsLimit = data.allowedTransferringRequestsLimit;
    this.allowedReschedulingRequestsLimit = data.allowedReschedulingRequestsLimit;
  }

}
