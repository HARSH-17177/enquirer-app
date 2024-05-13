import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Enquirer, EnquirerReturnData } from '../models/enquirer';
import { EnquirerService } from './enquirer.service';
import { DocModel } from '../models/doc-model';

@Component({
  selector: 'app-enquirer-add',
  templateUrl: './enquirer-add.component.html',
  styleUrls: ['./enquirer-add.component.css']
})
export class EnquirerAddComponent {
  enquiryForm: any;
  isLoading = false;
  enquirerModel: Enquirer =  <Enquirer>{};
  documentModel: DocModel = new DocModel();
  enqid: number = 0;

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

      DocType: [''],
      DocFile: [null, Validators.required] 
    });
  }

  get f() { return this.enquiryForm.controls; }
  onFileChange(event:any) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (!file.type.startsWith('image')) {
        this.enquiryForm.get('DocFile').setErrors({ required: true });
     
      } else {
        this.enquiryForm.patchValue({ DocFile: file });
   
      }
    }
  }
  submit() {
    // Extract Enquirer data from the form
    this.enquirerModel = {
      EnquiryId: 0,
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
      IsActive: 0
    };
  
    // Extract DocModel data from the form
    this.documentModel = {
      DocId: 0,
      EnqId: 0, // Will be updated later
      CustId: 0, // Update if necessary
      DocType: this.f.DocType.value,
      IsApproved: false,
      DocFile: this.f.DocFile.value
    };
  
    this.isLoading = true;
    this.service.createEnquiry(this.enquirerModel).subscribe((enquiryResponse: any) => {
      if (enquiryResponse && enquiryResponse.enqId && enquiryResponse.email) {
        console.log('Enquiry created:', enquiryResponse);
        const enquiryId = enquiryResponse.enqId;
  
        // Update document model with the generated enquiry ID
        const documentModel = {
          DocId: 0,
          EnqId: enquiryId,
          CustId:0,
          IsApproved:false,
          DocType: this.enquiryForm.get('DocType').value,
          DocFile: this.enquiryForm.get('DocFile').value
        };
  
        // Submit document form
        this.service.uploadDocument(documentModel).subscribe(() => {
          console.log('Document uploaded successfully');
          // Handle success
          this.isLoading = false;
  
          // Send email
          const mailModel = {
            enquirerId: enquiryResponse.enqId.toString(),
            receiverMail: enquiryResponse.email.toString()
          };
        
          this.service.sendMail(mailModel).subscribe(() => {
            console.log('Mail sent successfully');
            alert('Enquiry submitted successfully');
          }, error => {
            console.error('Error sending mail:', error);
            alert('Enquiry submitted successfully, but there was an error sending email');
          });
  
        }, error => {
          console.error('Error uploading document:', error);
          this.isLoading = false;
        });
  
      } else {
        console.error('Invalid response from server:', enquiryResponse);
        this.isLoading = false;
      }
    }, error => {
      console.error('Error creating enquiry:', error);
      this.isLoading = false;
    });
  }
  
}
