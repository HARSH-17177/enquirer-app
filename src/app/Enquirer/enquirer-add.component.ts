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
  documentModel: DocModel[] = [];
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

      DocType1: [''],
      DocFile1: [null, Validators.required],
      DocType2: [''],
      DocFile2: [null, Validators.required],
      DocType3: [''],
      DocFile3: [null, Validators.required]
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
  submit() {
    this.isLoading=true;
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
    for (let i = 1; i <= 3; i++) {
      const docTypeControlName = `DocType${i}`;
      const docFileControlName = `DocFile${i}`;

      const docModel: DocModel = {
        docId: 0,
        enqId: 0, // Will be updated later
        custId: 0, // Update if necessary
        docType: this.enquiryForm.get(docTypeControlName).value,
        isApproved: false,
        docFile: this.enquiryForm.get(docFileControlName).value
      };
console.log(docModel)

      this.documentModel.push(docModel);
    }
  
    this.isLoading = true;
     this.service.createEnquiry(this.enquirerModel).subscribe((enquiryResponse: any) => {
      if (enquiryResponse && enquiryResponse.enqId && enquiryResponse.email) {
        console.log('Enquiry created:', enquiryResponse);
        const enquiryId = enquiryResponse.enqId;

        // Update each document model with the generated enquiry ID
        this.documentModel.forEach((docModel, index) => {
          docModel.enqId = enquiryId;

          // Upload each document
          this.service.uploadDocument(docModel).subscribe(() => {
            console.log(`Document ${index + 1} uploaded successfully`);

            // Handle success if all documents are uploaded
            if (index === this.documentModel.length - 1) {
             

              // Send email
              const mailModel = {
                enquirerId: enquiryResponse.enqId.toString(),
                receiverMail: enquiryResponse.email.toString()
              };

              this.service.sendMail(mailModel).subscribe(() => {
                console.log('Mail sent successfully');
                this.isLoading = false;
                this.enquiryForm.reset();
                alert('Enquiry submitted successfully');
                
              }, error => {
                console.error('Error sending mail:', error);
                alert('Enquiry submitted successfully, but there was an error sending email');
              });
            }
          }, error => {
            console.error(`Error uploading document ${index + 1}:`, error);
            this.isLoading = false;
          });
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
