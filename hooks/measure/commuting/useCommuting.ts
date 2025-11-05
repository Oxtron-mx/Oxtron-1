import {useDictionary} from "@/hooks/shared/useDictionary";
import {useModal} from "@/hooks/shared/useModal";
import {useEffect, useState} from "react";
import {Commuting, CommutingValidation} from "@/lib/validation";
import {toast} from "@/components/ui/use-toast";
import {useCommutingStore} from "@/store/measure/commuting";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export const useCommuting = () => {
  const {isLoading, dictionary} = useDictionary()
  const {
    commuting,
    commute,
    facilities,
    createCommuting,
    fetchCommuting,
    fetchFormData,
    setLoading,
    setCommute,
    updateCommuting,
    loading,
  } = useCommutingStore()
  const {showModal, handleShowModal, handleHideModal} = useModal()
  const [facilityOptions, setFacilityOptions] = useState<Option[]>([])
  const [cards, setCards] = useState<Card[]>([])

  const form = useForm<Commuting>({
    resolver: zodResolver(CommutingValidation),
    defaultValues: {
      idControlCommuting: 0,
      idUserControl: 0,
      description: '',
      idControlFacility: 0,
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
        setCommute(null)
        form.reset({
          idControlCommuting: 0,
          idUserControl: 0,
          description: '',
          idControlFacility: 0,
          active: 1,
        })
      }
    },
  ]

  useEffect(() => {
    fetchCommuting()
    fetchFormData()
  }, [])

  useEffect(() => {
    setLoading(true)
    const cards: Card[] = commuting?.map((commute) => ({
      id: commute.idControlCommuting || 0,
      title: `${facilities.find((facility) => commute.idControlFacility === facility.idControlFacility)?.idFacility}`,
      description: '',// 'Mexico City, Mexico',
      icon: {
        src: '/assets/icons/black/Edit.png',
        position: 'head',
        onClick: () => {
          handleShowModal()
          setCommute(commute!)
        },
      },
      link: `/${commute.idControlCommuting}`,
      lastUpdated: new Date(2022, 10, 23),
    })) || []

    setCards(cards)
    setLoading(false)
  }, [commuting])

  useEffect(() => {
    setLoading(true)
    setFacilityOptions(facilities?.map((facility) => ({
      value: facility?.idControlFacility?.toString() || '0',
      label: facility.idFacility,
    })) || [])
    setLoading(false)
  }, [facilities]);

  useEffect(() => {
    if (commute) {
      form.reset({
        idControlCommuting: commute?.idControlCommuting ?? 0,
        idUserControl: commute?.idUserControl ?? 0,
        description: commute?.description ?? '',
        idControlFacility: commute?.idControlFacility ?? 0,
        active: commute?.active ?? 1,
      })
    }

    console.log(commute)
  }, [commute]);

  const onSubmit = async (commuting: Commuting) => {
    setLoading(true)
    try {
      if (commuting.idControlCommuting) {
        console.log()
        await updateCommuting(commuting);

        toast({
          title: dictionary?.measure.modal.toast.update.title,
          description: dictionary?.measure.modal.toast.update.description,
          className: 'bg-black',
        });
      } else {
        await createCommuting(commuting);

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
    commuting,
    commute,
    showModal,
    handleShowModal,
    handleHideModal,
    facilityOptions,
    cards,
    onSubmit,
    loading,
    items,
    buttons,
    form,
  }
}