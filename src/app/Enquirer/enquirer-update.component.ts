import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocModel } from '../models/doc-model';
import { Enquirer } from '../models/enquirer';
import { EnquirerService } from './enquirer.service';

@Component({
  selector: 'app-enquirer-update',
  templateUrl: './enquirer-update.component.html',
  styleUrls: ['./enquirer-update.component.css']
})
export class EnquirerUpdateComponent implements OnInit {
  enquiryForm: any;
  isLoading = false;
  enquirerModel: Enquirer = <Enquirer>{};
  documentModels: DocModel[] = []; // Array to store multiple documents
  enqid: number = 0;
  imageData: any[] = []; // Array to store image data for each document

  constructor(
    private fb: FormBuilder,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private service: EnquirerService
  ) {
    this.enquiryForm = this.fb.group({
      EnquiryId: [''],
      InitialBalance: [''],
      Email: [''],
      FirstName: [''],
      LastName: [''],
      Addr: [''],
      PanNo: [''],
      AadhaarNo: [''],
      PhoneNo: [''],
      City: [''],
      Stat: [''],
      Country: [''],
      PinCode: [''],
      MaritalStatus: [''],
      Gender: [''],
      Age: [''],
      AccType: [''],
      GuardianName: [''],
      GuardianAccount: [''],
      GuardianPhoneNo: [''],
      GuardianEmail: [''],
      GuardianAadhaar: [''],
      IsActive: [''],
      
      //  DocType: [''], 
      //  DocFile: [null] 
      DocType1: [''],
      DocFile1: [null],
      DocType2: [''],
      DocFile2: [null],
      DocType3: [''],
      DocFile3: [null]
    });
  }

  get f() { return this.enquiryForm.controls; }

  onFileChange(event: any, index: number) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (!file.type.startsWith('image')) {
        this.enquiryForm.get(`DocFile${index}`).setErrors({ required: true });
      } else {
        this.enquiryForm.patchValue({ [`DocFile${index}`]: file });
      }
    }
  }

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe(params => {
      this.enqid = Number(params.get('id'));
      this.service.getEnquiry(this.enqid).subscribe((response: any) => {
        this.enquirerModel = <Enquirer>response;
        console.log(response);
        this.enquiryForm.patchValue({
          EnquiryId: response['enquiryId'],
          InitialBalance: response['initialBalance'],
          Email: response['email'],
          FirstName: response['firstName'],
          LastName: response['lastName'],
          Addr: response['addr'],
          PanNo: response['panNo'],
          AadhaarNo: response['aadhaarNo'],
          PhoneNo: response['phoneNo'],
          City: response['city'],
          Stat: response['stat'],
          Country: response['country'],
          PinCode: response['pinCode'],
          MaritalStatus: response['maritalStatus'],
          Gender: response['gender'],
          Age: response['age'],
          AccType: response['accType'],
          GuardianName: response['guardianName'],
          GuardianAccount: response['guardianAccount'],
          GuardianPhoneNo: response['guardianPhoneNo'],
          GuardianEmail: response['guardianEmail'],
          GuardianAadhaar: response['guardianAadhaar'],
          IsActive: response['isActive']
        });

        this.service.getDocumentidbyEnquiryId(this.enqid).subscribe((docIds: any) => {
          if (docIds && docIds.length > 0) {
            let index=1;
            docIds.forEach((docId: number) => {
              this.service.getDocument(docId).subscribe((docResponse: any) => {
          
                if (docResponse) {
         console.log(docResponse.docModel)
                  this.documentModels.push(docResponse['docModel']); 
                  this.imageData.push(docResponse['imageData']);
                  this.enquiryForm.patchValue({ [`DocType${index}`]: this.documentModels[index-1].docType  });
                 //  this.enquiryForm.patchValue({ [`docFile${index}`]: this.imageData[index]  });
                  // this.documentModel = docResponse.docModel; 
                // this.enquiryForm.patchValue({ DocType: docResponse['docModel']['docType'] });
index++;
                }
                console.log(this.documentModels);
              }, (error: any) => {
                console.error('Error fetching document:', error);
              });
            });
          }
        }, (error: any) => {
          console.error('Error fetching document IDs:', error);
        });
      });
    });
  }

  submit() {
    this.enquirerModel = {
      EnquiryId: this.f.EnquiryId.value,
      InitialBalance: this.f.InitialBalance.value,
      Email: this.f.Email.value,
      FirstName: this.f.FirstName.value,
      LastName: this.f.LastName.value,
      Addr: this.f.Addr.value,
      PanNo: this.f.PanNo.value,
      AadhaarNo: this.f.AadhaarNo.value,
      PhoneNo: this.f.PhoneNo.value,
      City: this.f.City.value,
      Stat: this.f.Stat.value,
      Country: this.f.Country.value,
      PinCode: this.f.PinCode.value,
      MaritalStatus: this.f.MaritalStatus.value,
      Gender: this.f.Gender.value,
      Age: this.f.Age.value,
      AccType: this.f.AccType.value,
      GuardianName: this.f.GuardianName.value,
      GuardianAccount: this.f.GuardianAccount.value,
      GuardianPhoneNo: this.f.GuardianPhoneNo.value,
      GuardianEmail: this.f.GuardianEmail.value,
      GuardianAadhaar: this.f.GuardianAadhaar.value,
      IsActive: this.f.IsActive.value
    };

    this.isLoading = true;

    this.service.updateEnquiry(this.enquirerModel).subscribe((enquiryResponse: any) => {
      this.isLoading = false;

      // Update documents 
      this.documentModels.forEach((docModel, index) => {
        // Update document if there are changes in the form
        const updatedDocumentModel: DocModel = {
          docId: docModel.docId,
          enqId: docModel.enqId,
          custId: docModel.custId,
          docType: this.enquiryForm.get('DocType'+(index+1))?.value || docModel.docType, // Get DocType from form or use existing value
          isApproved: docModel.isApproved,
          docFile: this.enquiryForm.get('DocFile'+(index+1)).value  // Get DocFile from form if available
        };
console.log(updatedDocumentModel.docFile)
        this.service.updateDocument(updatedDocumentModel).subscribe(() => {
          // Handle success for each document update 
        }, (error: any) => {
          console.error('Error updating document:', error);
        });
      });

    }, (error: any) => {
      console.error('Error updating enquiry:', error);
      this.isLoading = false;
    });
  }
}