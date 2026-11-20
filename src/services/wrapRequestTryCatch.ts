import { useNotificationStore } from '@/stores/notificationStore';

interface RequestOptions {
    hideSuccessNotification?: boolean;
    errorNotificationTitle?: string;
    errorNotificationDescription?: string;
    successNotificationTitle?: string;
    successNotificationDescription?: string;
    timeout?: number;
}

interface WrapRequestOptions<T> {
    request: () => Promise<T>;
    options?: RequestOptions;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const DEFAULT_OPTIONS: Required<RequestOptions> = {
    hideSuccessNotification: true,
    errorNotificationTitle: 'Nieoczekiwany błąd',
    errorNotificationDescription: 'Wystąpił błąd podczas pobierania danych. Spróbuj ponownie.',
    successNotificationTitle: 'Sukces',
    successNotificationDescription: 'Operacja zakończona pomyślnie.',
    timeout: 3000,
};

export async function wrapRequestTryCatch<T>({ request, options = {} }: WrapRequestOptions<T>): Promise<T> {
    const notificationStore = useNotificationStore();

    const config = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    try {
        const response = await request();

        if (!config.hideSuccessNotification) {
            notificationStore.addNotification({
                summary: config.successNotificationTitle,
                detail: config.successNotificationDescription,
                severity: 'success',
                timeout: config.timeout,
            });
        }

        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;

        notificationStore.addNotification({
            summary: config.errorNotificationTitle,
            detail: apiError.response?.data?.message ?? config.errorNotificationDescription,
            severity: 'error',
            timeout: config.timeout,
        });

        throw error;
    }
}
