import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enquirer } from '../models/enquirer';
import { DocModel } from '../models/doc-model';
import { Enquirermail } from '../models/enquirermail';

const enquirerUrl ="https://enquirerserviceabrg.azurewebsites.net";
const mailUrl ="https://mailerserviceabrg.azurewebsites.net/SendEnquirerMail"

@Injectable({
  providedIn: 'root'
})
export class EnquirerService {
  constructor(private http: HttpClient) { }

  createEnquiry(model:Enquirer)  {
    var body= JSON.stringify(model);
   var options ={
headers:{
  "Content-Type" : "application/json"
}
   };
   return this.http.post(`${enquirerUrl}/createEnquiry`,body,options);
  }

  uploadDocument(model: DocModel) {
    const formData = new FormData();
    formData.append('EnqId', model.EnqId.toString());
    formData.append('CustId', model.CustId.toString());
    formData.append('DocType', model.DocType);
    formData.append('IsApproved', model.IsApproved.toString());
    formData.append('DocFile', model.DocFile as Blob);
  
    return this.http.post(`${enquirerUrl}/uploadDoc`, formData);
  }
  

  getEnquiry(id:number)
  {
    return this.http.get(`${enquirerUrl}/getEnquirerById/${id}`);
  }
  
  getDocument(docid:number)
  {
    return this.http.get(`${enquirerUrl}/getDocWithImage/${docid}`);
  }

  
  sendMail(model:Enquirermail)
  {
    var body= JSON.stringify(model);
    var options ={
 headers:{
   "Content-Type" : "application/json"
 }
    };
    return this.http.post(`${mailUrl}`,body,options);
  }


  getDocumentidbyEnquiryId(enquiryid:number)
  {
    return this.http.get(`${enquirerUrl}/GetDocumentIds/${enquiryid}`)
  }


  updateEnquiry(model: Enquirer) {
    var body = JSON.stringify(model);
    var options = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return this.http.put(`${enquirerUrl}/updateEnquirer/${model.EnquiryId}`, body, options);
  }
  updateDocument(model: DocModel) {
    const formData = new FormData();
    formData.append('DocId', model.DocId.toString());
    formData.append('EnqId', model.EnqId.toString());
    formData.append('CustId', model.CustId.toString());
    formData.append('DocType', model.DocType);
    formData.append('IsApproved', model.IsApproved.toString());
    formData.append('DocFile', model.DocFile as Blob);
  
    return this.http.put(`${enquirerUrl}/updateDoc/${model.DocId}`, formData);
  }
}
