import {useDictionary} from "@/hooks/shared/useDictionary";
import {useLogisticStore} from "@/store/measure/logistics";
import {useModal} from "@/hooks/shared/useModal";
import {useEffect, useState} from "react";
import {Logistic, LogisticValidation} from "@/lib/validation";
import {toast} from "@/components/ui/use-toast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export const useLogistics = () => {
  const {isLoading, dictionary} = useDictionary()
  const {
    steps,
    logistics,
    logistic,
    brands,
    models,
    statuses,
    types,
    vehicles,
    createLogistic,
    fetchLogistics,
    fetchFormData,
    fetchModels,
    setCurrentStep,
    setLoading,
    setLogistic,
    updateLogistic,
    loading,
    setResetCurrentStep,
    currentStep,
  } = useLogisticStore()
  const {showModal, handleShowModal, handleHideModal} = useModal()
  const [brandOptions, setBrandOptions] = useState<Option[]>([])
  const [modelOptions, setModelOptions] = useState<Option[]>([])
  const [statusOptions, setStatusOptions] = useState<Option[]>([])
  const [typeOptions, setTypeOptions] = useState<Option[]>([])
  const [vehicleOptions, setVehicleOptions] = useState<Option[]>([])
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isModelDisabled, setIsModelDisabled] = useState<boolean>(true)
  const [cards, setCards] = useState<Card[]>([])
  const [status, setStatus] = useState<string>('')
  const form = useForm<Logistic>({
    resolver: zodResolver(LogisticValidation),
    defaultValues: {
      idUserControl: 0,
      idCboModel: 0,
      idCboBrand: 0,
      idCboStatus: 0,
      idTravelCboType: 0,
      licensePlate: '',
      client: '',
      name: '',
      destination: '',
      origin: '',
      destinationzc: '',
      originzc: '',
      loadLogistic: '',
      propertyStatus: 0,
      idControlVehicle: 0,
      active: 1,
    },
  })
  const watchedFirstStepItems = form.watch([
    'origin',
    'destination',
    'originzc',
    'destinationzc',
  ])
  const watchedSecondStepItems = form.watch([
    'propertyStatus',
    'idControlVehicle',
  ])
  const watchBrand = form.watch(['idCboBrand'])
  const items: string[] = [dictionary?.measure.bar[0]]

  const buttons: IIconButton[] = [
    {
      src: '/assets/icons/black/Search.png',
      alt: 'Search icon',
      size: 'xs',
      text: dictionary?.measure.search,
      onClick: () => {
      },
    },
    {
      src: '/assets/icons/black/Add New-1.png',
      alt: 'Add icon',
      size: 'xs',
      text: dictionary?.measure.add,
      onClick: () => {
        handleShowModal()
        setLogistic(null)
        form.reset({
          idUserControl: 0,
          idCboModel: 0,
          idCboBrand: 0,
          idCboStatus: 0,
          idTravelCboType: 0,
          licensePlate: '',
          client: '',
          name: '',
          destination: '',
          origin: '',
          destinationzc: '',
          originzc: '',
          loadLogistic: '',
          propertyStatus: 0,
          idControlVehicle: 0,
          active: 1,
        })
      }
    },
  ]

  useEffect(() => {
    fetchLogistics()
    fetchFormData()
  }, [])

  useEffect(() => {
    setLoading(true)
    const cards: Card[] = logistics?.map((logistic) => ({
      id: logistic.idControlLogistics || 0,
      title: `${logistic.origin} - ${logistic.destination}`,
      description: '',// 'Mexico City, Mexico',
      icon: {
        src: '/assets/icons/black/Edit.png',
        position: 'head',
        onClick: () => {
          handleShowModal()
          setLogistic(logistic)
        },
      },
      link: `/${logistic.idControlLogistics}`,
      lastUpdated: new Date(2022, 10, 23),
    })) || []

    setCards(cards)
    setLoading(false)
  }, [logistics])

  useEffect(() => {
    setLoading(true)
    setBrandOptions(brands?.map((brand) => ({
      value: brand.idVehicleCboBrand.toString(),
      label: brand.description
    })) || [])
    setModelOptions(models?.map((model) => ({
      value: model.idVehicleCboModel.toString(),
      label: model.description,
    })) || [])
    setStatusOptions(statuses?.map((status) => ({
      value: status.idStatus.toString(),
      label: status.description,
    })) || [])
    setTypeOptions(types?.map((type) => ({
      value: type.idVehicleCboType.toString(),
      label: type.description,
    })) || [])
    setVehicleOptions(
      vehicles?.map(vehicle => ({
        value: vehicle?.idControlVehicle?.toString() || '0',
        label: vehicle.name || '',
      })) || []
    )
    setLoading(false)
  }, [brands, models, statuses, types]);

  useEffect(() => {
    const allFieldsSet = Object.values(watchedFirstStepItems).every(
      (value) => value !== undefined && value !== null && value !== ''
    );

    if (allFieldsSet) {
      setIsDisabled(false)
    }
  }, [watchedFirstStepItems]);

  useEffect(() => {
    const allFieldsSet = Object.values(watchedSecondStepItems).every(
      (value) => value !== undefined && value !== null && value !== 0
    );

    if (allFieldsSet) {
      setIsDisabled(false)
    }
  }, [watchedSecondStepItems]);

  useEffect(() => {
    if (logistic) {
      form.reset({
        idControlLogistics: logistic?.idControlLogistics ?? 0,
        idUserControl: logistic?.idUserControl ?? 0,
        idCboModel: logistic?.idCboModel ?? 0,
        idCboBrand: logistic?.idCboBrand ?? 0,
        idCboStatus: logistic?.idCboStatus ?? 0,
        idTravelCboType: logistic?.idTravelCboType ?? 0,
        licensePlate: logistic?.licensePlate ?? '',
        client: logistic?.client ?? '',
        name: logistic?.name ?? '',
        destination: logistic?.destination ?? '',
        origin: logistic?.origin ?? '',
        destinationzc: logistic?.destinationzc ?? '',
        originzc: logistic?.originzc ?? '',
        loadLogistic: logistic?.loadLogistic ?? '',
        active: logistic?.active ?? 1
      })
    }
  }, [logistic]);

  useEffect(() => {
    const isBrandSet = Object.values(watchBrand).some(
      (value) => value !== undefined && value !== null && value !== 0
    );

    setIsModelDisabled(!isBrandSet);

    if (isBrandSet) {
      fetchModels(watchBrand[0] || 0).then(() => setIsModelDisabled(false));
    }
  }, [JSON.stringify(watchBrand)]);

  const nextStep = () => {
    const allFieldsSet = Object.values(watchedFirstStepItems).every(
      (value) => value !== undefined && value !== null && value !== ''
    );

    if (allFieldsSet) {
      setIsDisabled(false)
      form.clearErrors()
    } else {
      setIsDisabled(true)
      form.trigger()
      return
    }
    if (currentStep < steps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (logistic: Logistic) => {
    try {
      if (logistic.idControlLogistics) {
        await updateLogistic({...logistic, idCboStatus: Number(status) || 0});

        toast({
          title: dictionary?.measure.modal.toast.update.title,
          description: dictionary?.measure.modal.toast.update.description,
          className: 'bg-black',
        });
      } else {
        await createLogistic({...logistic, idCboStatus: Number(status) || 0});

        toast({
          title: dictionary?.measure.modal.toast.create.title,
          description: dictionary?.measure.modal.toast.create.description,
          className: 'bg-black',
        });
      }

      setResetCurrentStep()
      setLoading(false)
      handleHideModal()
    } catch (error) {
      toast({
        variant: "destructive",
        title: dictionary?.measure.modal.toast.error.title,
        description: dictionary?.measure.modal.toast.error.description,
        className: 'bg-black',
      });
    }
  }

  return {
    dictionary,
    isLoading,
    logistics,
    logistic,
    showModal,
    handleShowModal,
    handleHideModal,
    brands: brandOptions,
    models: modelOptions,
    statuses: statusOptions,
    types: typeOptions,
    vehicles: vehicleOptions,
    isModelDisabled,
    cards,
    onSubmit,
    loading,
    items,
    steps,
    setCurrentStep,
    status,
    setStatus,
    buttons,
    currentStep,
    nextStep,
    prevStep,
    form,
    isDisabled,
  }
}