import { useForm } from 'react-hook-form';

export const useCustomForm = (options = {}) => {
    const methods = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        ...options
    });

    return {
        ...methods,
        register: (name, options = {}) => ({
            ...methods.register(name, options),
            onChange: (e) => {
                methods.setValue(name, e.target.value);
            }
        })
    };
}; 