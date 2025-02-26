'use client';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

export default function Loading() {
  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Skeleton variant="text" width="50%" height={40} />
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="rectangular" height={200} />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
