import {useDictionary} from "@/hooks/shared/useDictionary";
import {useTravelStore} from "@/store/measure/travels";
import {useModal} from "@/hooks/shared/useModal";
import {useEffect, useState} from "react";
import {Travel, TravelValidation} from "@/lib/validation";
import {toast} from "@/components/ui/use-toast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export const useTravels = () => {
  const {dictionary} = useDictionary()
  const {
    loading,
    travels,
    travel,
    createTravel,
    fetchTravels,
    updateTravel,
    setLoading,
    setTravel,
  } = useTravelStore()
  const {showModal, handleShowModal, handleHideModal} = useModal()
  const [cards, setCards] = useState<Card[]>([])

  const form = useForm<Travel>({
    resolver: zodResolver(TravelValidation),
    defaultValues: {
      idControlTravel: travel?.idControlTravel ?? 0,
      idUserControl: travel?.idUserControl ?? 0,
      idTravel: travel?.idTravel ?? '',
      description: travel?.description ?? '',
      active: travel?.active ?? 1,
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
        setTravel(null)
        form.reset({
          idControlTravel: 0,
          idUserControl: 0,
          idTravel: '',
          description: '',
          active: 1,
        });
      },
    },
  ]

  useEffect(() => {
    fetchTravels()
  }, [])

  useEffect(() => {
    setLoading(true)
    const cards: Card[] = travels?.map((travel) => ({
      id: travel.idControlTravel || 0,
      title: `${travel.idTravel}`,
      description: '',// 'Mexico City, Mexico',
      icon: {
        src: '/assets/icons/black/Edit.png',
        position: 'head',
        onClick: () => {
          handleShowModal()
          setTravel(travel)
        },
      },
      link: `/${travel.idControlTravel}`,
      lastUpdated: new Date(2022, 10, 23),
    })) || []

    setCards(cards)
  }, [travels])

  useEffect(() => {
    if (travel) {
      form.reset({
        idControlTravel: travel?.idControlTravel ?? 0,
        idUserControl: travel?.idUserControl ?? 0,
        idTravel: travel?.idTravel ?? '',
        description: travel?.description ?? '',
        active: travel?.active ?? 1,
      });
    }
  }, [travel]);

  const onSubmit = async (travel: Travel) => {
    try {
      if (travel.idControlTravel) {
        await updateTravel(travel);

        toast({
          title: dictionary?.measure.modal.toast.update.title,
          description: dictionary?.measure.modal.toast.update.description,
          className: 'bg-black',
        });
      } else {
        await createTravel(travel);

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
    travel,
    travels,
    dictionary,
    showModal,
    handleShowModal,
    handleHideModal,
    cards,
    onSubmit,
    loading,
    items,
    buttons,
    form,
  }
}
