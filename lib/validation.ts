import { z } from "@/zod.config";

// --------------------------- Auth
export const UserFormValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(7)
    .max(15),
})
export type Login = z.infer<typeof UserFormValidation>

export const UserRegisterValidation = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  organisationName: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  // active: z.string().min(1).max(1).default('1'),
  telephoneUser: z.string().min(10),
  timeZone: z.string().min(1),
  language: z.string().min(1),
  // idUSerType: z.number().positive().int().default(1),
})
export type UserRegister = z.infer<typeof UserRegisterValidation>

export const UserRegisterByCompanyIdValidation = z.object({
  idCompany: z.number(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idUSerType: z.coerce.number(),
  role: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  telephoneUser: z.string().min(10),
  timeZone: z.string().min(1),
  language: z.string().min(1),
})
export type UserRegisterByCompanyId = z.infer<typeof UserRegisterByCompanyIdValidation>;

export const ForgotPasswordValidation = z.object({
  email: z.string().email().min(1),
})

export const UpdatePasswordValidation = z.object({
  email: z.string().email().min(1),
  passwordOld: z.string().min(6),
  passwordNew: z.string().min(6),
  confirmPassword: z.string().min(6),
})
export type UpdatePassword = z.infer<typeof UpdatePasswordValidation>

export const UpdateUserValidation = z.object({
  idUSerControl: z.number().positive(),
  idCompany: z.number(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  confirmPassword: z.string().min(6),
  active: z.string().min(1),
  idUSerType: z.coerce.number(),
  telephoneUser: z.string().min(1),
  timeZone: z.string().min(1),
  language: z.string().min(1),
})
export type UpdateUser = z.infer<typeof UpdateUserValidation>

// --------------------------- Measure
export const FacilityValidation = z.object({
  idControlFacility: z.coerce.number().optional(),
  idUserControl: z.number().optional(),
  idFacility: z.string().min(1),
  propertyStatus: z.coerce.number().positive(),
  city: z.string().min(1),
  country: z.string().min(1),
  description: z.string().optional(),
  active: z.number().max(1).min(0).default(1),
})
export type Facility = z.infer<typeof FacilityValidation>;

export const FacilityDetailsValidation = z.object({
  idControlFacilityDetails: z.number().int().optional(),
  invoiceId: z.string().optional(),
  unit: z.string().optional(),
  typeEquipment: z.string().optional(),

  idControlFacility: z.number().int().min(1),
  idType: z
    .string()
    .min(1)
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) throw new Error("idType must be a valid number");
      return parsed;
    }),
  idEmissionFactor: z.number().int().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  idTypeDetails: z.number().int().min(1),
  amount: z.number().int().min(1),
  measureFugitive: z.number().int().min(1),
  purchased: z.number().min(1),
  delivered: z.number().min(1),
  returnsProducers: z
    .string()
    .min(1)
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) throw new Error("returnsProducers must be a valid number");
      return parsed;
    }),
  returnedUsers: z
    .string()
    .min(1)
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) throw new Error("returnedUsers must be a valid number");
      return parsed;
    }),
  returnedOffsiteRecycling: z.number().min(1),
  partialNAmeplateCharged: z.number().min(1),
  amountYearsBeginning: z.number().min(1),
  amountYearsEnd: z.number().min(1),
  chargedIntoEquipment: z.number().min(1),
  dontKnow: z.number().int().min(1),
  offSiteRecycling: z
    .string()
    .min(1)
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) throw new Error("offSiteRecycling must be a valid number");
      return parsed;
    }),
  offSiteDestruction: z
    .string()
    .min(1)
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) throw new Error("offSiteDestruction must be a valid number");
      return parsed;
    }),
  densityPressurePartial: z
    .string()
    .min(1)
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) throw new Error("densityPressurePartial must be a valid number");
      return parsed;
    }),
  densityPressureFull: z
    .string()
    .min(1)
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) throw new Error("densityPressureFull must be a valid number");
      return parsed;
    }),
  active: z.number().int().min(1),
});

export type FacilityDetails = z.infer<typeof FacilityDetailsValidation>;

export const FacilityDescriptionDetailsValidation = z.object({
  idControlFacilityDetails: z.number().int().optional(),
  idControlFacility: z.number().int().min(1),
  idType: z.union([z.string(), z.number()]).transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  idTypeDescription: z.string().optional(),
  idEmissionFactor: z.number().int().min(1),
  idEmissionFactorDescription: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  invoiceId: z.string().optional(),
  idTypeDetails: z.number().int().min(1),
  idTypeDetailsDescription: z.string().optional(),
  amount: z.number().int().min(1),
  unit: z.string().optional(),
  typeEquipment: z.string().optional(),
  measureFugitive: z.number().int().min(0),
  purchased: z.string().transform((val) => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  delivered: z.string().transform((val) => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  returnsProducers: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  returnedUsers: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  returnedOffsiteRecycling: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  partialNAmeplateCharged: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  amountYearsBeginning: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  amountYearsEnd: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  chargedIntoEquipment: z.string().transform((val) => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  dontKnow: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  offSiteRecycling: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  offSiteDestruction: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  densityPressurePartial: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  densityPressureFull: z.string().transform(val => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  active: z.number().int().min(0),
  firstName: z.string().min(0),
})
export type FacilityDescriptionDetails = z.infer<typeof FacilityDescriptionDetailsValidation>;

export const VehicleValidation = z.object({
  idControlVehicle: z.coerce.number().optional(),
  idUserControl: z.number().optional(),
  idStatus: z.coerce.number().positive(),
  name: z.string().optional(),
  idCboBrand: z.coerce.number().positive(),
  idCboModel: z.coerce.number().positive(),
  idCboType: z.coerce.number().positive(),
  licensePlate: z.string().optional(),
  active: z.number().max(1).min(0).default(1),
})
export type Vehicle = z.infer<typeof VehicleValidation>

export const VehicleDetailsValidation = z.object({
  idControlVehicleDetails: z
    .number()
    .int()
    .optional(),
  idControlVehicle: z
    .number()
    .int(),
  idEmissionFactor: z
    .number()
    .int(),
  startDate: z
    .string()
    .datetime(),
  endDate: z
    .string()
    .datetime(),
  invoiceId: z
    .string()
    .optional()
    .or(z.literal('')),
  idVehicleCboType: z
    .string()
    .transform((val) => {
      const parsed = Number(val)
      if (isNaN(parsed)) return 0
      return parsed
    }),
  amount: z
    .string()
    .transform((val) => {
      const parsed = Number(val)
      if (isNaN(parsed)) return 0
      return parsed
    }),
  unit: z
    .string()
    .optional(),
  active: z
    .number()
    .int(),
})
export type VehicleDetails = z.infer<typeof VehicleDetailsValidation>

export const VehicleDescriptionDetailsValidation = z.object({
  idControlVehicleDetails: z
    .number()
    .int()
    .optional(),
  idControlVehicle: z
    .number()
    .int(),
  idEmissionFactor: z
    .number()
    .int(),
  idEmissionFactorDescription: z.string().min(1),
  startDate: z
    .string()
    .datetime(),
  endDate: z
    .string()
    .datetime(),
  invoiceId: z
    .string()
    .optional()
    .or(z.literal('')),
  idVehicleCboType: z
    .string()
    .transform((val) => {
      const parsed = Number(val)
      if (isNaN(parsed)) return 0
      return parsed
    }),
  cboTypeDescription: z.string().min(1),
  amount: z
    .string()
    .transform((val) => {
      const parsed = Number(val)
      if (isNaN(parsed)) return 0
      return parsed
    }),
  unit: z
    .string()
    .optional(),
  active: z
    .number()
    .int(),
})
export type VehicleDescriptionDetails = z.infer<typeof VehicleDescriptionDetailsValidation>

export const TravelValidation = z.object({
  idControlTravel: z.coerce.number().optional(),
  idUserControl: z.number().optional(),
  idTravel: z.string().min(1),
  description: z.string().optional(),
  active: z.number().max(1).min(0).default(1),
})
export type Travel = z.infer<typeof TravelValidation>

export const TravelDetailsValidation = z.object({
  idControlTravelDetails: z.number().int().optional(),
  idControlTravel: z.number().int(),
  idEmissionFactor: z.number().int(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  invoiceId: z.string().optional(),
  idTravelCboType: z.coerce.number(),
  origin: z.string().optional(),
  destiny: z.string().optional(),
  originzc: z.string().min(1),
  destinyzc: z.string().min(1),
  amount: z.coerce.number(),
  unit: z.string().min(1),
  active: z.number().int(),
})
export type TravelDetails = z.infer<typeof TravelDetailsValidation>;

export const TravelDescriptionDetailsValidation = z.object({
  idControlTravelDetails: z
    .number()
    .int()
    .optional(),
  idControlTravel: z
    .number()
    .int(),
  idEmissionFactor: z
    .number()
    .int(),
  idEmissionFactorDescription: z.string().min(1),
  startDate: z
    .string()
    .datetime(),
  endDate: z
    .string()
    .datetime(),
  invoiceId: z
    .string()
    .optional(),
  idTravelCboType: z
    .number()
    .int(),
  travelCboTypeDescription: z.string().min(1),
  origin: z
    .string()
    .optional(),
  destiny: z
    .string()
    .optional(),
  active: z
    .number()
    .int(),
})
export type TravelDescriptionDetails = z.infer<typeof TravelDescriptionDetailsValidation>;

export const FirstStepLogisticValidation = z.object({
  idControlLogistics: z.coerce.number().optional(),
  idUserControl: z.number().optional(),
  origin: z.string().min(1),
  destination: z.string().min(1),
  originzc: z.string().min(1),
  destinationzc: z.string().min(1),
  loadLogistic: z.string().optional(),
  client: z.string().optional(),
})

export const SecondStepLogisticValidation = z.object({
  idCboStatus: z.coerce.number().positive('This field is required'),
  name: z.string().optional(),
  idTravelCboType: z.coerce.number().positive('This field is required'),
  idCboModel: z.coerce.number().optional(),
  idCboBrand: z.coerce.number().optional(),
  licensePlate: z.string().optional(),
  active: z.number().max(1).min(0).default(1),
})
export const ThirdStepLogisticValidation = z.object({
  propertyStatus: z.coerce.number().positive('This field is required'),
  idControlVehicle: z.coerce.number().positive('This field is required'),
})
export const LogisticValidation = FirstStepLogisticValidation.merge(SecondStepLogisticValidation).merge(ThirdStepLogisticValidation)
export type Logistic = z.infer<typeof LogisticValidation>

export const LogisticDetailsValidation = z.object({
  idControlLogisticsDetails: z.number().int().optional(),
  idControlLogistics: z.coerce.number().int(),
  idEmissionFactor: z.number().int(),
  origin: z.string(),
  destiny: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  invoiceId: z.string().optional(),
  idFuelType: z.coerce.number().optional(),
  amount: z.coerce.number().min(1),
  unit: z.string().optional(),
  active: z.number().default(1),
})
export type LogisticDetails = z.infer<typeof LogisticDetailsValidation>

export const LogisticDescriptionDetailsValidation = z.object({
  idControlLogisticsDetails: z
    .number()
    .int()
    .optional(),
  idControlLogistics: z
    .number()
    .int(),
  idEmissionFactor: z
    .number()
    .int(),
  idEmissionFactorDescription: z.string().optional(),
  origin: z.string().optional(),
  destiny: z.string().optional(),
  startDate: z
    .string()
    .datetime(),
  endDate: z
    .string()
    .datetime(),
  invoiceId: z.string().optional(),
  idFuelType: z
    .union([z.string(), z.number()])
    .transform(val => {
      const parsed = Number(val)
      if (isNaN(parsed)) throw new Error('Invalid number')
      return parsed
    }),
  fuelTypeDescription: z.string().optional(),
  amount: z
    .union([z.string(), z.number()])
    .transform(val => {
      const parsed = Number(val)
      if (isNaN(parsed)) throw new Error('Invalid number')
      return parsed
    }),
  unit: z.union([z.string(), z.null()]).optional(),
  active: z
    .number()
    .int(),
})
export type LogisticDescriptionDetails = z.infer<typeof LogisticDescriptionDetailsValidation>

export const ManufacturingValidation = z.object({
  idControlManufacturing: z.coerce.number().optional(),
  idUserControl: z.number().optional(),
  process: z.string().min(1),
  idFacility: z.coerce.number().min(1),
  idTypeEquipment: z.coerce.number().min(1),
  idTypeFuelUsed: z.coerce.number().min(1),
  idTypeEquipmentCode: z.coerce.number().min(0),
  active: z.number().max(1).min(0).default(1),
})
export type Manufacturing = z.infer<typeof ManufacturingValidation>

export const ManufacturingDetailsValidation = z.object({
  idControlManufacturingDetails: z
    .number()
    .int()
    .optional(),
  idControlManufacturing: z
    .number()
    .int(),
  idEmissionFactor: z
    .number()
    .int(),
  invoiceId: z
    .string()
    .optional(),
  startDate: z
    .string()
    .datetime(),
  endDate: z
    .string()
    .datetime(),
  amount: z
    .string().transform(val => {
      const parsed = Number(val)
      if (isNaN(parsed)) throw new Error('Invalid number')
      return parsed
    })
    .optional(),
  unit: z
    .string()
    .optional(),
  active: z
    .number()
    .int(),
})
export type ManufacturingDetails = z.infer<typeof ManufacturingDetailsValidation>

export const ManufacturingDescriptionDetailsValidation = z.object({
  idControlManufacturingDetails: z
    .number()
    .int()
    .optional(),
  idControlManufacturing: z
    .number()
    .int(),
  idEmissionFactor: z
    .number()
    .int(),
  idEmissionFactorDescription: z.string().optional(),
  invoiceId: z.string().optional(),
  startDate: z
    .string()
    .datetime(),
  endDate: z
    .string()
    .datetime(),
  amount: z
    .union([z.string(), z.number()])
    .transform(val => {
      const parsed = Number(val)
      if (isNaN(parsed)) throw new Error('Invalid number')
      return parsed
    })
    .optional(),
  unit: z.string().optional(),
  active: z
    .number()
    .int(),
})
export type ManufacturingDescriptionDetails = z.infer<typeof ManufacturingDescriptionDetailsValidation>

export const CommutingValidation = z.object({
  idControlCommuting: z.coerce.number().optional(),
  idUserControl: z.number().optional(),
  idControlFacility: z.coerce.number().min(1),
  description: z.string().optional(),
  active: z.number().max(1).min(0).default(1),
})
export type Commuting = z.infer<typeof CommutingValidation>

export const CommutingDetailsValidation = z.object({
  idControlCommutingDetails: z.number().int().optional(),
  idControlCommuting: z.coerce.number().int(),
  origin: z.string().nonempty(),
  originZipCode: z.coerce.number(),
  destination: z.string().nonempty(),
  distinationZipCode: z.coerce.number(),
  distance: z.string(),
  fuelEfficiency: z.coerce.number(),
  // active: z.number().int().default(1),
  idCommutingCboModeTransport: z.coerce.number(),
  // cboModeTransportDescription: z.coerce.number().default(0),
  // activity: z.string().default(''),
  unit: z.string().default(''),
  // status: z.string().default(''),
})
export type CommutingDetails = z.infer<typeof CommutingDetailsValidation>;

export const CommutingDescriptionDetailsValidation = z.object({
  idControlCommutingDetails: z
    .number()
    .int(),
  idControlCommuting: z
    .number()
    .int(),
  origin: z
    .string()
    .optional(),
  originZipCode: z
    .string()
    .optional(),
  destination: z
    .string()
    .optional(),
  distinationZipCode: z
    .string()
    .optional(),
  distance: z
    .string()
    .optional(),
  fuelEfficiency: z
    .string()
    .transform(val => {
      const parsed = Number(val)
      if (isNaN(parsed)) throw new Error('Invalid number')
      return parsed
    })/* .refine(val => val >= 0, { message: 'Fuel efficiency is required' }) */,
  active: z
    .number()
    .int()
    .default(1),
  idCommutingCboModeTransport: z.number().positive().int(),
  cboModeTransportDescription: z.string().min(1),
  activity: z.string().min(1),
  unit: z.string().min(1),
  status: z.string().min(1),
  idUserControl: z.string().min(1),
})
export type CommutingDescriptionDetails = z.infer<typeof CommutingDescriptionDetailsValidation>;

export const CompanyValidation = z.object({
  idCompany: z.number().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  organisatioName: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  active: z.string().min(1),
  registrationDate: z.string().min(1),
  idTypeLicense: z.number(),
  address: z.string().min(1),
  telephoneCompany: z.string().min(1),
  size: z.string().min(1),
  industry: z.string().min(1),
  imageBase64: z.string().optional(),
})
export type Company = z.infer<typeof CompanyValidation>;

// Communicate
export const ReportHeaderValidation = z.object({
  idControl: z.number().optional(),
  idUserControl: z.number().min(1),
  preparedBy: z.string().optional(),
  facilityId: z.string().optional(),
  idType: z.string().transform((val) => {
    const parsed = Number(val)
    if (isNaN(parsed)) throw new Error('Invalid number')
    return parsed
  }),
  typeDescription: z.string().optional(),
  startDate: z.string().refine(value => !isNaN(Date.parse(value))),
  endDate: z.string().refine(value => !isNaN(Date.parse(value))),
  active: z.number().min(1).default(() => 1),
})
export type ReportHeader = z.infer<typeof ReportHeaderValidation>

export const CommunicateSchema = z.object({
  idControlCommunicate: z.number().optional(),
  idUserControl: z.number().optional(),
  idControlFacility: z.coerce.number(),
  idFacility: z.string(),
  type: z.string(),
  startDate: z
    .string()
    .datetime(),
  endDate: z
    .string()
    .datetime(),
  firstName: z.string().optional(),
});
export type Communicate = z.infer<typeof CommunicateSchema>;

export const ComboValidation = z.object({
  idControl: z.number(),
  description: z.string(),
  units: z.string(),
});
export type ComboType = z.infer<typeof ComboValidation>;
