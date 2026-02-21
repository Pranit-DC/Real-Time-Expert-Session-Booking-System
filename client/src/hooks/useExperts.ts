import { useQuery } from '@tanstack/react-query';
import { getExperts } from '../api/experts';
import type { ExpertsResponse } from '../types';

interface UseExpertsOptions {
  page: number;
  category: string;
  search: string;
}

const LIMIT = 8;

export const useExperts = ({ page, category, search }: UseExpertsOptions) => {
  return useQuery<ExpertsResponse, Error>({
    queryKey: ['experts', page, category, search],
    queryFn: () =>
      getExperts({
        page,
        limit: LIMIT,
        category: category || undefined,
        search: search || undefined,
      }),
    placeholderData: (prev) => prev, // keeps previous page visible while next loads
    staleTime: 30_000,
  });
};
