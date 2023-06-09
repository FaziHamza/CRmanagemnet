import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  // This should be replaced with the actual API data
  // permissions: any = [/* Your permissions data */];
  permissions = [
    {
      "permissionCatId": 7,
      "perCatName": "Promissory Notes Permissions",
      "createdAt": "2023-10-04T00:00:00",
      "createdBy": 57,
      "permissionSubCategories": [
        {
          "perSubCatName": "Promissory Notes Orders",
          "permissionSubCatId": 39,
          "permissionItems": [
            {
              "perItemName": "View Only",
              "permissionItemId": 78,
              "selected": false,
              "permissionItemDetails": []
            },
            {
              "perItemName": "View & Manage",
              "permissionItemId": 79,
              "selected": false,
              "permissionItemDetails": []
            },
            {
              "perItemName": "None",
              "permissionItemId": 80,
              "selected": true,
              "permissionItemDetails": []
            }
          ]
        },
        {
          "perSubCatName": "Promissory Notes Requests",
          "permissionSubCatId": 40,
          "permissionItems": [
            {
              "perItemName": "View Only",
              "permissionItemId": 81,
              "selected": false,
              "permissionItemDetails": []
            },
            {
              "perItemName": "View & Manage",
              "permissionItemId": 82,
              "selected": false,
              "permissionItemDetails": []
            },
            {
              "perItemName": "None",
              "permissionItemId": 83,
              "selected": false,
              "permissionItemDetails": []
            }
          ]
        }
      ]
    }
  ];
  constructor(private apiService: ApiService) {
    // this.apiService.getPermissions(17002).subscribe(res=>{
    //   if(res.isSuccess){
    //     this.permissions = res.data;
    //   }
    // })
   }

  // Function to check if a permission is granted
  checkPermission(catId: number, subCatId: number, permissionItemId: number) {
    if(this.permissions){
      const cat = this.permissions.find((cat: any) => cat.permissionCatId === catId);
      if (!cat) return false;

      const subCat = cat.permissionSubCategories.find((sub: any) => sub.permissionSubCatId === subCatId);
      if (!subCat) return false;

      const item = subCat.permissionItems.find((item: any) => item.permissionItemId === permissionItemId);
      if (!item) return false;

      return item.selected;
    }else{
      return false;
    }

  }
}
