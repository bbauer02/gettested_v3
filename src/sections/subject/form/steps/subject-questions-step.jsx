import { useFormContext } from 'react-hook-form';



export function SubjectQuestionsStep() {
  const { watch } = useFormContext();
  const values = watch();

  console.dir(values);
  return (
    <>
      SubjectQuestionsStep
    </>
  )
}
