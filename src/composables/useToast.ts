
import { toastController } from '@ionic/vue';

export function useToast() {
  const presentToast = async (
    message: string,
    color: 'light' | 'success' | 'warning' | 'danger' = 'light',
    position: 'top' | 'middle' | 'bottom' = 'bottom',
    duration = 2000,
  ) => {
    const toast = await toastController.create({
      message,
      duration,
      position,
      color,
    });

    await toast.present();
  };

  return {
    presentToast,
  };
}
