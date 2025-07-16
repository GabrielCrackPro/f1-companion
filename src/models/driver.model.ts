export interface Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  constructor: {
    id: string;
    name: string;
    drivers: string[];
    color: string;
  };
}
