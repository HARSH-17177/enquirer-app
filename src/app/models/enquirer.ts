export class Enquirer {
  constructor(
    public EnquiryId: number,
    public InitialBalance: number,
    public Email: string,
    public FirstName: string,
    public LastName: string,
    public Addr: string,
    public PanNo: string,
    public AadhaarNo: string,
    public PhoneNo: string,
    public City: string,
    public Stat: string,
    public Country: string,
    public PinCode: string,
    public MaritalStatus: string,
    public Gender: string,
    public Age: number,
    public AccType: number,
    public GuardianName: string,
    public GuardianAccount: string,
    public GuardianPhoneNo: string,
    public GuardianEmail: string,
    public GuardianAadhaar: string,
    public IsActive: number,

  ) {}
}
export class EnquirerReturnData {
  constructor(
    public EnqId: number,
    public Email: string
  ) {}
}