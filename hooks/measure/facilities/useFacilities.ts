import {useEffect, useState} from "react";
import { toast } from "@/components/ui/use-toast";
import {Status} from "@/constants/types";
import {useDictionary} from "@/hooks/shared/useDictionary";
import {useModal} from "@/hooks/shared/useModal";
import {useStatusStore} from "@/store/shared/combos/Status";
import {Facility, FacilityValidation} from "@/lib/validation";
import {useFacilityStore} from "@/store/measure/facilities";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export function useFacilities() {
  const { dictionary } = useDictionary()
  const {showModal, handleShowModal, handleHideModal} = useModal()
  const {
    facilities,
    facility,
    fetchFacilities,
    setFacility,
    setLoading,
    updateFacility,
    createFacility,
    loading,
  } = useFacilityStore()
  const {statuses, fetchStatuses} = useStatusStore()
  const [options, setOptions] = useState<Option[]>([])
  const [cards, setCards] = useState<Card[]>([])

  const form = useForm<Facility>({
    resolver: zodResolver(FacilityValidation),
    defaultValues: {
      idControlFacility: 0,
      idUserControl: 0,
      idFacility: "",
      city: "",
      country: "",
      description: "",
      propertyStatus: 0,
      active: 1,
    },
  });

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
        setFacility(null)
        form.reset({
          idControlFacility: 0,
          idUserControl: 0,
          idFacility: "",
          city: "",
          country: "",
          description: "",
          propertyStatus: 0,
          active: 1,
        })
      },
    },
  ]

  useEffect(() => {
    console.log('useFacilities: Calling fetchFacilities and fetchStatuses')
    fetchFacilities()
    fetchStatuses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLoading(true)

    const cards: Card[] = facilities?.map((facility: Facility) => (
      {
        id: facility.idControlFacility || 0,
        title: facility?.idFacility,
        description: /* facility?.description || */ '',
        icon: {
          src: '/assets/icons/black/Edit.png',
          position: 'head',
          onClick: () => {
            form.reset({
              idControlFacility: facility?.idControlFacility ?? 0,
              idUserControl: facility?.idUserControl ?? 0,
              idFacility: facility?.idFacility ?? "",
              city: facility?.city ?? "",
              country: facility?.country ?? "",
              description: facility?.description ?? "",
              propertyStatus: facility?.propertyStatus ?? 0,
              active: facility?.active ?? 1,
            })
            setFacility(null)
            setFacility(facility)
            handleShowModal()
          },
        },
        link: `/${facility.idControlFacility}`,
        lastUpdated: new Date(2022, 10, 23),
        onClick: () => {
          form.reset({
            idControlFacility: facility?.idControlFacility ?? 0,
            idUserControl: facility?.idUserControl ?? 0,
            idFacility: facility?.idFacility ?? "",
            city: facility?.city ?? "",
            country: facility?.country ?? "",
            description: facility?.description ?? "",
            propertyStatus: facility?.propertyStatus ?? 0,
            active: facility?.active ?? 1,
          })
          setFacility(null)
          setFacility(facility)
        },
      }
    )) || []
    setCards(cards)

    setLoading(false)
  }, [facilities]);

  useEffect(() => {
    setLoading(true)

    const options: Option[] = statuses?.map((status: Status) => (
      {
        value: status.idStatus.toString(),
        label: status.description,
      }
    )) || []
    setOptions(options)

    setLoading(false)
  }, [statuses]);

  useEffect(() => {
    if (facility) {
      form.reset({
        idControlFacility: facility?.idControlFacility ?? 0,
        idUserControl: facility?.idUserControl ?? 0,
        idFacility: facility?.idFacility ?? "",
        city: facility?.city ?? "",
        country: facility?.country ?? "",
        description: facility?.description ?? "",
        propertyStatus: facility?.propertyStatus ?? 0,
        active: facility?.active ?? 1,
      })
    }
  }, [facility])

  const onSubmit = async (facility: Facility) => {
    try {
      if (facility.idControlFacility) {
        await updateFacility(facility);

        toast({
          title: dictionary?.measure.modal.toast.update.title || "Success",
          description: dictionary?.measure.modal.toast.update.description || "Facility updated successfully!",
          className: 'bg-black',
        });
      } else {
        await createFacility(facility);

        toast({
          title: dictionary?.measure.modal.toast.create.title || "Success",
          description: dictionary?.measure.modal.toast.create.description || "Facility created successfully!",
          className: 'bg-black',
        });
      }

      await fetchFacilities()
      handleHideModal()
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: dictionary?.measure.modal.toast.error.title || "Error",
        description: dictionary?.measure.modal.toast.error.description || "Something went wrong while processing the facility.",
        className: 'bg-black',
      });
    }
  }

  return {
    loading,
    dictionary,
    items,
    cards,
    buttons,
    showModal,
    handleHideModal,
    facility,
    options,
    form,
    onSubmit,
  }
}
