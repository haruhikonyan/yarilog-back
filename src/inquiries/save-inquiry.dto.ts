export class SaveInquiryDto {
  content!: string;
  mailAddress!: string;
  isVerified!: boolean;
  name!: string;
  author!: string;
  inquiryTypeId!: string;
  inquiryType: object = {};
}
