import {useDictionary} from "@/hooks/shared/useDictionary";
import {useModal} from "@/hooks/shared/useModal";
import {useEffect, useState} from "react";
import {Manufacturing, ManufacturingValidation} from "@/lib/validation";
import {toast} from "@/components/ui/use-toast";
import {useManufacturingStore} from "@/store/measure/manufacturing";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export const useManufacturing = () => {
  const {isLoading, dictionary} = useDictionary()
  const {
    manufacturing,
    manufacture,
    facilities,
    fuel,
    equipment,
    createManufacturing,
    fetchManufacturing,
    fetchFormData,
    setLoading,
    setManufacture,
    updateManufacturing,
    loading,
  } = useManufacturingStore()
  const {showModal, handleShowModal, handleHideModal} = useModal()
  const [facilityOptions, setFacilityOptions] = useState<Option[]>([])
  const [fuelOptions, setFuelOptions] = useState<Option[]>([])
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([])
  const [cards, setCards] = useState<Card[]>([])

  const form = useForm<Manufacturing>({
    resolver: zodResolver(ManufacturingValidation),
    defaultValues: {
      idControlManufacturing: 0,
      idUserControl: 0,
      idFacility: 0,
      idTypeEquipment: 0,
      idTypeEquipmentCode: 0,
      idTypeFuelUsed: 0,
      process: '',
      active: 1,
    },
  })

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
        setManufacture(null)
        form.reset({
          idControlManufacturing: 0,
          idUserControl: 0,
          idFacility: 0,
          idTypeEquipment: 0,
          idTypeEquipmentCode: 0,
          idTypeFuelUsed: 0,
          process: '',
          active: 1,
        })
      }
    },
  ]

  useEffect(() => {
    fetchManufacturing()
    fetchFormData()
  }, [])

  useEffect(() => {
    setLoading(true)
    const cards: Card[] = manufacturing?.map((manufacturing) => ({
      id: manufacturing.idControlManufacturing || 0,
      title: `${manufacturing.process}`,
      description: '',// 'Mexico City, Mexico',
      icon: {
        src: '/assets/icons/black/Edit.png',
        position: 'head',
        onClick: () => {
          handleShowModal()
          setManufacture(manufacturing!)
        },
      },
      link: `/${manufacturing.idControlManufacturing}`,
      lastUpdated: new Date(2022, 10, 23),
    })) || []

    setCards(cards)
  }, [manufacturing])

  useEffect(() => {
    setLoading(true)
    setFacilityOptions(facilities?.map((facility) => ({
      value: facility?.idControlFacility?.toString() || '0',
      label: facility.idFacility,
    })) || [])
    setFuelOptions(fuel?.map((f) => ({
      value: f.id.toString(),
      label: f.name,
    })) || [])
    setEquipmentOptions(equipment?.map((eq) => ({
      value: eq.id.toString() || '0',
      label: eq.name,
    })) || [])
    setLoading(false)
  }, [facilities, fuel, equipment]);

  useEffect(() => {
    if (manufacture){
      form.reset({
        idControlManufacturing: manufacture?.idControlManufacturing ?? 0,
        idUserControl: manufacture?.idUserControl ?? 0,
        idFacility: manufacture?.idFacility ?? 0,
        idTypeEquipment: manufacture?.idTypeEquipment ?? 0,
        idTypeEquipmentCode: manufacture?.idTypeEquipmentCode ?? 0,
        idTypeFuelUsed: manufacture?.idTypeFuelUsed ?? 0,
        process: manufacture?.process ?? '',
        active: manufacture?.active ?? 1,
      })
    }
  }, [manufacture]);

  const onSubmit = async (manufacturing: Manufacturing) => {
    try {
      if (manufacturing.idControlManufacturing) {
        await updateManufacturing(manufacturing);

        toast({
          title: dictionary?.measure.modal.toast.update.title,
          description: dictionary?.measure.modal.toast.update.description,
          className: 'bg-black',
        });
      } else {
        await createManufacturing(manufacturing);

        toast({
          title: dictionary?.measure.modal.toast.create.title,
          description: dictionary?.measure.modal.toast.create.description,
          className: 'bg-black',
        });
      }

      setLoading(false)
      handleHideModal()
    } catch (error) {
      console.error(error);
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
    manufacturing,
    manufacture,
    showModal,
    handleShowModal,
    handleHideModal,
    facilityOptions,
    fuelOptions,
    equipmentOptions,
    cards,
    onSubmit,
    loading,
    items,
    buttons,
    form,
  }
}