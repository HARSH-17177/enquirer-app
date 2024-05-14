import { Component, OnInit } from '@angular/core';
import { EnquirerService } from './enquirer.service';

@Component({
  selector: 'app-enquirer-view',
  templateUrl: './enquirer-view.component.html',
  styleUrls: ['./enquirer-view.component.css']
})
export class EnquirerViewComponent implements OnInit {
  enquiryId: number = 0;
  enquiry: any;
  documents: any;

  constructor(private enquirerService: EnquirerService) { }

  ngOnInit(): void {
    this.fetchEnquiryDetails();
  }

  fetchEnquiryDetails() {
    const enquiryIdInput = prompt('Please enter Enquiry ID:');
    if (enquiryIdInput) {
      this.enquiryId = Number(enquiryIdInput);
      this.enquirerService.getEnquiry(this.enquiryId).subscribe((enquiry: any) => {
        this.enquiry = enquiry;
        this.loadDocuments();
      }, error => {
        console.error('Error fetching enquiry details:', error);
      });
    }
  }

  loadDocuments() {
    this.enquirerService.getDocumentidbyEnquiryId(this.enquiryId).subscribe((documentIds: any) => {
      this.documents = [];
      documentIds.forEach((documentId: any, index: any) => {
        this.enquirerService.getDocument(documentId).subscribe((document: any) => {
          this.documents.push(document);
          if (index === documentIds.length - 1) {
            console.log(this.documents);
          }
        }, error => {
          console.error('Error fetching document:', error);
        });
      });
    }, error => {
      console.error('Error fetching document IDs:', error);
    });
  }
}
