import { useFieldArray, useFormContext } from 'react-hook-form';

import { Field } from 'src/components/hook-form';
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {Iconify} from "../../components/iconify";
import Box from "@mui/material/Box";

export function QuestionNewEditMcq() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({ control, name: 'mcqItems' });

  const values = watch();

  return (
    <Box sx={{ p: 3 }}>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>

        <Field.Text
          size="small"
          name={`question`}
          label="Question"
          InputLabelProps={{ shrink: true }}
        />

        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Field.Text
                size="small"
                name={`mcqItems[${index}].answer`}
                label="Answer"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => console.log("remove idem")}
            >
              Remove
            </Button>
          </Stack>
        ))}
      </Stack>
      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => console.log("add idem")}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>
      </Stack>
    </Box>
  );

}
