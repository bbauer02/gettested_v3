import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export function RHFAutocomplete({ name, label, slotProps, helperText, placeholder, ...other }) {
  const { control, setValue } = useFormContext();

  const { textfield, ...otherSlotProps } = slotProps ?? {};
  
  // Extraire le onChange personnalisé pour l'utiliser tout en préservant le comportement par défaut
  const { onChange: customOnChange, ...otherProps } = other;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        //console.log(`RHFAutocomplete ${name} render avec field.value:`, field.value);
        
        return (
          <Autocomplete
            {...field}
            id={`rhf-autocomplete-${name}`}
            onChange={(event, newValue) => {
              //console.log(`RHFAutocomplete ${name} onChange standard:`, newValue);
              
              // Mettre à jour la valeur dans le formulaire
              setValue(name, newValue, { shouldValidate: true });
              
              // Si un onChange personnalisé est fourni, l'appeler
              if (customOnChange) {
               // console.log(`RHFAutocomplete ${name} appel du onChange personnalisé après setValue`);
                customOnChange(event, newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...textfield}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message ?? helperText}
                slotProps={{
                  ...textfield?.slotProps,
                  htmlInput: {
                    ...params.inputProps,
                    autoComplete: 'new-password',
                    ...textfield?.slotProps?.htmlInput,
                  },
                }}
              />
            )}
            {...otherProps}
            {...otherSlotProps}
          />
        );
      }}
    />
  );
}
