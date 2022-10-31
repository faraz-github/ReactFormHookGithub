import { Button, Container, Stack, TextField, Autocomplete } from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  firstName: string;
  lastName: string;
  age: number;
  skill: string;
  os: { name: string }[];
};

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Please enter first name"),
  lastName: yup.string().required("Please enter last name").min(5, "Minimum 5 characters are needed"),
  age: yup.number().transform((value) => (isNaN(value) ? null : value)).required("Please enter age").nullable(),
  skill: yup.string().required("Please select skill").nullable()
})

// Resource Data
const topSkills = ["HTML", "CSS", "JavaScript", "TypeScript", "React"];

function MySuperForm() {

  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  });

  // console.log({ errors }, { isValid }, { control });

  const { fields, append, prepend } = useFieldArray({ control, name: "os" })

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <Container maxWidth={"xs"} sx={{ p: 1 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={1}>
          <TextField
            label={errors?.firstName ? "Error in first name" : "First Name"}
            {...register("firstName")}
            placeholder="First Name"
            size='small'
            error={errors?.firstName ? true : false}
            helperText={errors?.firstName && errors.firstName.message}
          />

          <TextField
            label={errors?.lastName ? "Error in last name" : "Last Name"}
            variant="standard"
            {...register("lastName")}
            placeholder="Last Name"
            size='small'
            error={errors?.lastName ? true : false}
            helperText={errors?.lastName && errors.lastName.message}
          />

          <TextField
            label={errors?.age ? "Error in age" : "Age"}
            variant="standard"
            type={"number"}
            {...register("age", { valueAsNumber: true })}
            placeholder="Age"
            size='small'
            error={errors?.age ? true : false}
            helperText={errors?.age && errors.age.message}
          />

          <Controller
            render={({ field }) => (
              <Autocomplete
                size='small'
                {...field}
                options={topSkills}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country"
                    error={errors?.skill ? true : false}
                    helperText={errors?.skill && errors.skill.message}
                  />
                )}
                onChange={(_, data) => field.onChange(data)}
              />
            )}
            {...register("skill")}
            control={control}
          />

          {fields.map((field, index) => {
            return <TextField key={field.id}
              variant="standard"
              {...register(`os.${index}.name`)}
              placeholder="Enter Operating System"
              size='small'
              error={errors?.os ? true : false}
              helperText={errors?.os && errors.os.message}
            />
          })}

          <Stack direction={"row"} sx={{ p: 1 }}>
            <Button sx={{ mx: 1 }} type='button' variant='contained' color='error' onClick={() => { append({ name: "" }) }}>Append</Button>
            <Button sx={{ mx: 1 }} type='button' variant='contained' color='error' onClick={() => { prepend({ name: "" }) }}>Prepend</Button>
          </Stack>

          <Button variant='contained' disabled={!isValid ? true : false} type={"submit"}>Submit</Button>
        </Stack>

      </form>
    </Container>
  );
}

export default MySuperForm;
