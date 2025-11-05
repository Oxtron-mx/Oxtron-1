'use server'
import { AxiosError } from 'axios'
import axiosInstance from '@/lib/axios-instance'
import { API_BASE_URL, getApiKey } from '@/utils/api-config'
import {
  CommutingDescriptionDetails,
  CommutingDetails,
  FacilityDescriptionDetails,
  LogisticDescriptionDetails,
  LogisticDetails,
  ManufacturingDescriptionDetails,
  ManufacturingDetails,
  TravelDescriptionDetails,
  TravelDetails,
  VehicleDescriptionDetails,
  VehicleDetails
} from '@/lib/validation'
import {getAuthenticatedUserId} from "@/actions/shared";

export async function getCommutingDetails(idCommuting: number) {
  try {
    const response = await axiosInstance.get('/CommutingDetails/Mostrar_CommutingDetails_ControlLogisticDescription', {
      params: { idCommuting }
    })

    const data = response.data as CommutingDescriptionDetails[]

    return {
      status: response.status,
      success: true,
      data: data.filter((detail) => detail.active === 1)
    }
  } catch (error) {
    const axiosError = error as unknown as AxiosError

    console.error({ error })

    return { status: axiosError.response?.status, success: false, data: [] }
  }
}

export async function createCommutingDetails(commutingDetails: CommutingDetails) {
  try {
    const idUserControl = await getAuthenticatedUserId();
    const response = await axiosInstance.post('/CommutingDetails/Registrar_CommutingDetails',
      {
        ...commutingDetails,
        originZipCode: commutingDetails.originZipCode.toString(),
        distinationZipCode: commutingDetails.distinationZipCode.toString(),
        cboModeTransportDescription: null,
        idUserControl: idUserControl.toString(),
      })

    return { status: response.status, success: true, data: response.data }
  } catch (error) {

    const axiosError = error as unknown as AxiosError

    console.error({ error })

    return { status: axiosError.response?.status, success: true, data: axiosError.response?.data }
  }
}

export async function updateCommutingDetails(commutingDetails: CommutingDetails) {
  try {
    const idUserControl = await getAuthenticatedUserId();
    const response = await axiosInstance.put('/CommutingDetails/Actualizar_CommutingDetails', {
      ...commutingDetails,
      idUserControl: idUserControl.toString(),
      distinationZipCode: commutingDetails.distinationZipCode.toString(),
      originZipCode: commutingDetails.originZipCode.toString(),
    })
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError

    console.error({ error })

    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function deleteCommutingDetails(IdCommuting: number) {
  try {
    const response = await axiosInstance.delete('/CommutingDetails/Eliminar_CommutingDetails', {
      params: { IdCommuting }
    })
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError

    console.error({ error })

    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function getFacilityDetails(idFacilities: number) {
  try {
    const apiKey = await getApiKey();

    // Fetch emission activities for this facility/emitter
    const resp = await axiosInstance.get(
      `${API_BASE_URL}/api/organization/emission-activity/emitter/${idFacilities}?api_key=${apiKey}`
    )
    const activities = resp.data?.data || []

    // Preload measure units for mapping unit_id -> symbol/name
    const muResp = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`
    )
    const units = muResp.data?.data || []

    // Map activities to FacilityDescriptionDetails-like rows used by the table
    const mapped: FacilityDescriptionDetails[] = await Promise.all(
      activities.map(async (act: any) => {
        let emissionFactorName = ''
        try {
          const efResp = await axiosInstance.get(
            `${API_BASE_URL}/api/catalogs/emission-factor/id/${act.emission_factor_id}`
          )
          emissionFactorName = efResp.data?.data?.name || ''
        } catch (_) {}

        const unit = units.find((u: any) => u.id === act.unit_id)
        const created = act.created_at || ''

        return {
          idControlFacilityDetails: act.id,
          idControlFacility: idFacilities,
          idType: 0,
          idTypeDescription: emissionFactorName,
          idEmissionFactor: act.emission_factor_id,
          idEmissionFactorDescription: emissionFactorName,
          startDate: created,
          endDate: created,
          invoiceId: '',
          idTypeDetails: 0,
          idTypeDetailsDescription: '-',
          amount: Number(act.quantity ?? act.amount ?? 0),
          unit: unit?.symbol || unit?.name || '',
          typeEquipment: '',
          measureFugitive: 0,
          purchased: 0,
          delivered: 0,
          returnsProducers: 0,
          returnedUsers: 0,
          returnedOffsiteRecycling: 0,
          partialNAmeplateCharged: 0,
          amountYearsBeginning: 0,
          amountYearsEnd: 0,
          chargedIntoEquipment: 0,
          dontKnow: 0,
          offSiteRecycling: 0,
          offSiteDestruction: 0,
          densityPressurePartial: 0,
          densityPressureFull: 0,
          active: 1,
          firstName: '',
        } as unknown as FacilityDescriptionDetails
      })
    )

    return { status: 200, success: true, data: mapped }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('getFacilityDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: [] }
  }
}

export async function createFacilityDetails(facilityDetails: FacilityDescriptionDetails) {
  try {
    const apiKey = await getApiKey();
    
    // Resolve unit_id from catalog
    let unitId: number = 1;
    try {
      const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
      const units = muResp.data?.data || []
      if (facilityDetails.unit) {
        const match = units.find((u: any) => (
          u.symbol?.toLowerCase() === facilityDetails.unit.toLowerCase() ||
          u.name?.toLowerCase() === facilityDetails.unit.toLowerCase()
        ))
        if (match) unitId = match.id
      }
      if (unitId === 1 && units.length > 0) {
        unitId = units[0].id
      }
    } catch (err) {
      console.warn('Could not fetch measure-units, using default unit_id=1', err)
    }

    // Format dates to YYYY-MM-DD (backend expects this format, not ISO datetime)
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toISOString().split('T')[0] // YYYY-MM-DD
    }

    const startDate = formatDate(facilityDetails.startDate)
    const endDate = formatDate(facilityDetails.endDate)

    if (!startDate || !endDate) {
      throw new Error('start_date and end_date are required')
    }

    const payload = {
      emission_factor_id: Number(facilityDetails.idEmissionFactor),
      organization_emitter_id: Number(facilityDetails.idControlFacility),
      amount: String(facilityDetails.amount),
      unit_id: unitId,
      period: {
        start_date: startDate,
        end_date: endDate,
      },
    }

    console.log('Creating emission activity with payload:', payload)

    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/organization/emission-activity?api_key=${apiKey}`,
      payload
    )

    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError

    console.error('Error creating facility details:', error)
    if (axiosError.response) {
      console.error('Response data:', axiosError.response.data)
      console.error('Response status:', axiosError.response.status)
    }

    return { 
      status: axiosError.response?.status || 500, 
      success: false, 
      data: axiosError.response?.data || { message: 'Unknown error occurred' }
    }
  }
}

export async function updateFacilityDetails(facilityDetails: FacilityDescriptionDetails) {
  try {
    const response = await axiosInstance.put('/FacilitiesDetails/Actualizar_FacilitiesDetails', facilityDetails)
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError

    console.error({ error })

    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function deleteFacilityDetails(IdFacilities: number) {
  try {
    const response = await axiosInstance.delete('/FacilitiesDetails/Eliminar_FacilitiesDetails', {
      params: { IdFacilities }
    })
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError

    console.error({ error })

    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function getLogisticDetails(idLogistic: number) {
  try {
    const apiKey = await getApiKey();
    const resp = await axiosInstance.get(`${API_BASE_URL}/api/organization/emission-activity/emitter/${idLogistic}?api_key=${apiKey}`)
    const activities = resp.data?.data || []

    const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
    const units = muResp.data?.data || []

    const mapped: LogisticDescriptionDetails[] = activities.map((act: any) => {
      const unit = units.find((u: any) => u.id === act.unit_id)
      const created = act.created_at || ''
      return {
        idControlLogisticsDetails: act.id,
        idControlLogistics: idLogistic,
        idEmissionFactor: act.emission_factor_id,
        idEmissionFactorDescription: '',
        origin: '',
        destiny: '',
        startDate: created,
        endDate: created,
        invoiceId: '',
        idFuelType: 0,
        fuelTypeDescription: '',
        amount: Number(act.quantity ?? act.amount ?? 0),
        unit: unit?.symbol || unit?.name || '',
        active: 1,
      } as unknown as LogisticDescriptionDetails
    })

    return { status: 200, success: true, data: mapped }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('getLogisticDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: [] }
  }
}

export async function createLogisticDetails(logisticDetails: LogisticDetails) {
  try {
    const apiKey = await getApiKey();

    // resolve unit
    let unitId = 1
    try {
      const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
      const units = muResp.data?.data || []
      if (logisticDetails.unit) {
        const match = units.find((u: any) => (
          u.symbol?.toLowerCase() === logisticDetails.unit?.toLowerCase() ||
          u.name?.toLowerCase() === logisticDetails.unit?.toLowerCase()
        ))
        if (match) unitId = match.id
      }
      if (units.length && unitId === 1) unitId = units[0].id
    } catch (_) {}

    const formatDate = (d: string) => new Date(d).toISOString().split('T')[0]

    const payload = {
      emission_factor_id: Number(logisticDetails.idEmissionFactor),
      organization_emitter_id: Number(logisticDetails.idControlLogistics),
      amount: String(logisticDetails.amount),
      unit_id: unitId,
      period: {
        start_date: formatDate(logisticDetails.startDate as unknown as string),
        end_date: formatDate(logisticDetails.endDate as unknown as string),
      },
    }

    const response = await axiosInstance.post(`${API_BASE_URL}/api/organization/emission-activity?api_key=${apiKey}`, payload)
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('createLogisticDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function updateLogisticDetails(logisticDetails: LogisticDetails) {
  return createLogisticDetails(logisticDetails)
}

export async function deleteLogisticDetails(IdLogistic: number) {
  return { status: 405, success: false, data: { message: 'Delete not supported in demo' } }
}

export async function getManufacturingDetails(idManufacturing: number) {
  try {
    const apiKey = await getApiKey();
    const resp = await axiosInstance.get(`${API_BASE_URL}/api/organization/emission-activity/emitter/${idManufacturing}?api_key=${apiKey}`)
    const activities = resp.data?.data || []

    const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
    const units = muResp.data?.data || []

    const mapped: ManufacturingDescriptionDetails[] = activities.map((act: any) => {
      const unit = units.find((u: any) => u.id === act.unit_id)
      const created = act.created_at || ''
      return {
        idControlManufacturingDetails: act.id,
        idControlManufacturing: idManufacturing,
        idEmissionFactor: act.emission_factor_id,
        idEmissionFactorDescription: '',
        invoiceId: '',
        startDate: created,
        endDate: created,
        amount: Number(act.quantity ?? act.amount ?? 0),
        unit: unit?.symbol || unit?.name || '',
        active: 1,
      } as unknown as ManufacturingDescriptionDetails
    })

    return { status: 200, success: true, data: mapped }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('getManufacturingDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: [] }
  }
}

export async function createManufacturingDetails(manufacturingDetails: ManufacturingDetails) {
  try {
    const apiKey = await getApiKey();
    let unitId = 1
    try {
      const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
      const units = muResp.data?.data || []
      if (units.length) unitId = units[0].id
    } catch (_) {}

    const formatDate = (d: string) => new Date(d).toISOString().split('T')[0]

    const payload = {
      emission_factor_id: Number(manufacturingDetails.idEmissionFactor),
      organization_emitter_id: Number(manufacturingDetails.idControlManufacturing),
      amount: String(manufacturingDetails.amount || '0'),
      unit_id: unitId,
      period: {
        start_date: formatDate(manufacturingDetails.startDate as unknown as string),
        end_date: formatDate(manufacturingDetails.endDate as unknown as string),
      },
    }

    const response = await axiosInstance.post(`${API_BASE_URL}/api/organization/emission-activity?api_key=${apiKey}`, payload)
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('createManufacturingDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function updateManufacturingDetails(manufacturingDetails: ManufacturingDetails) {
  return createManufacturingDetails(manufacturingDetails)
}

export async function deleteManufacturingDetails(IdManufacturing: number) {
  return { status: 405, success: false, data: { message: 'Delete not supported in demo' } }
}

export async function getTravelDetails(idControl: number) {
  try {
    const apiKey = await getApiKey();
    const resp = await axiosInstance.get(`${API_BASE_URL}/api/organization/emission-activity/emitter/${idControl}?api_key=${apiKey}`)
    const activities = resp.data?.data || []

    const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
    const units = muResp.data?.data || []

    const mapped: TravelDescriptionDetails[] = activities.map((act: any) => {
      const unit = units.find((u: any) => u.id === act.unit_id)
      const created = act.created_at || ''
      return {
        idControlTravelDetails: act.id,
        idControlTravel: idControl,
        idEmissionFactor: act.emission_factor_id,
        idEmissionFactorDescription: '',
        startDate: created,
        endDate: created,
        invoiceId: '',
        idTravelCboType: 0,
        travelCboTypeDescription: '',
        origin: '',
        destiny: '',
        active: 1,
      } as unknown as TravelDescriptionDetails
    })

    return { status: 200, success: true, data: mapped }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('getTravelDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: [] }
  }
}

export async function createTravelDetails(travelDetails: TravelDetails) {
  try {
    const apiKey = await getApiKey();
    let unitId = 1
    try {
      const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
      const units = muResp.data?.data || []
      if (units.length) unitId = units[0].id
    } catch (_) {}

    const formatDate = (d: string) => new Date(d).toISOString().split('T')[0]

    const payload = {
      emission_factor_id: Number(travelDetails.idEmissionFactor),
      organization_emitter_id: Number(travelDetails.idControlTravel),
      amount: String(travelDetails.amount),
      unit_id: unitId,
      period: {
        start_date: formatDate(travelDetails.startDate),
        end_date: formatDate(travelDetails.endDate),
      },
    }

    const response = await axiosInstance.post(`${API_BASE_URL}/api/organization/emission-activity?api_key=${apiKey}`, payload)
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('createTravelDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function updateTravelDetails(travelDetails: TravelDetails) {
  return createTravelDetails(travelDetails)
}

export async function deleteTravelDetails(IdTravels: number) {
  return { status: 405, success: false, data: { message: 'Delete not supported in demo' } }
}

export async function getVehicleDetails(idControl: number) {
  try {
    const apiKey = await getApiKey();
    const resp = await axiosInstance.get(
      `${API_BASE_URL}/api/organization/emission-activity/emitter/${idControl}?api_key=${apiKey}`
    )
    const activities = resp.data?.data || []

    const muResp = await axiosInstance.get(
      `${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`
    )
    const units = muResp.data?.data || []

    const mapped: VehicleDescriptionDetails[] = activities.map((act: any) => {
      const unit = units.find((u: any) => u.id === act.unit_id)
      const created = act.created_at || ''
      return {
        idControlVehicleDetails: act.id,
        idControlVehicle: idControl,
        idEmissionFactor: act.emission_factor_id,
        idEmissionFactorDescription: '',
        startDate: created,
        endDate: created,
        invoiceId: '',
        idVehicleCboType: '0',
        cboTypeDescription: '',
        amount: String(act.quantity ?? act.amount ?? 0),
        unit: unit?.symbol || unit?.name || '',
        active: 1,
      } as unknown as VehicleDescriptionDetails
    })

    return { status: 200, success: true, data: mapped }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('getVehicleDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: [] }
  }
}

export async function createVehicleDetails(vehicleDetails: VehicleDetails) {
  try {
    const apiKey = await getApiKey();

    // resolve unit id if provided
    let unitId = 1
    try {
      const muResp = await axiosInstance.get(`${API_BASE_URL}/api/catalogs/measure-units?api_key=${apiKey}`)
      const units = muResp.data?.data || []
      if (vehicleDetails.unit) {
        const match = units.find((u: any) => (
          u.symbol?.toLowerCase() === vehicleDetails.unit?.toLowerCase() ||
          u.name?.toLowerCase() === vehicleDetails.unit?.toLowerCase()
        ))
        if (match) unitId = match.id
      }
      if (units.length && unitId === 1) unitId = units[0].id
    } catch (_) {}

    const formatDate = (d: string) => new Date(d).toISOString().split('T')[0]

    const payload = {
      emission_factor_id: Number(vehicleDetails.idEmissionFactor),
      organization_emitter_id: Number(vehicleDetails.idControlVehicle),
      amount: String(vehicleDetails.amount),
      unit_id: unitId,
      period: {
        start_date: formatDate(vehicleDetails.startDate as unknown as string),
        end_date: formatDate(vehicleDetails.endDate as unknown as string),
      },
    }

    const response = await axiosInstance.post(`${API_BASE_URL}/api/organization/emission-activity?api_key=${apiKey}`, payload)
    return { status: response.status, success: true, data: response.data }
  } catch (error) {
    const axiosError = error as unknown as AxiosError
    console.error('createVehicleDetails error:', axiosError.response?.data || error)
    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}

export async function updateVehicleDetails(vehicleDetails: VehicleDetails) {
  // For demo, create a new emission activity; backend does not expose update
  return createVehicleDetails(vehicleDetails)
}

export async function deleteVehicleDetails(IdVehicles: number) {
  // Not supported on new API for emission activities; return success=false
  return { status: 405, success: false, data: { message: 'Delete not supported in demo' } }
}

export async function getDistance (originZip: number, destinationZip: number)  {
  const apiKey = process.env.MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

  try {
    const response = await axiosInstance.get(url, {
      params: {
        origins: originZip,
        destinations: destinationZip,
        key: apiKey,
      },
    });

    const data = response.data;

    if (data.status === 'OK') {
      const distance = data.rows[0].elements[0].distance.value;
      const duration = data.rows[0].elements[0].duration.text;
      return { status: data.status, success: true, data: { originZip, destinationZip, distance, duration } };
    }
  } catch (error) {
    const axiosError = error as unknown as AxiosError

    return { status: axiosError.response?.status, success: false, data: axiosError.response?.data }
  }
}
