import { createAsyncThunk } from '@store/hooks.ts';
import { TCsrfState } from '@slices/csrf/type.ts';

export const getCsrfToken = createAsyncThunk<TCsrfState, void>(
  `csrf/getCsrfToken`,
  async (_, { extra: api }) => {
    return await api.getCsrfToken()
  }
)