export class DocModel {
    constructor(    public docId: number = 0,
        public enqId: number = 0,
        public custId: number = 0,
        public docType: string = '',
        public isApproved: boolean = false,
        public docFile: File | null = null,){}

  }

  export class DocWithImageData{
    constructor(
        public docModel:DocModel,
        public imageData:string
    )
    {

    }
  }