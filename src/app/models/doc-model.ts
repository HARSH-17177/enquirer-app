export class DocModel {
    constructor(    public DocId: number = 0,
        public EnqId: number = 0,
        public CustId: number = 0,
        public DocType: string = '',
        public IsApproved: boolean = false,
        public DocFile: File | null = null,){}

  }

  export class DocWithImageData{
    constructor(
        public docModel:DocModel,
        public imageData:string
    )
    {

    }
  }