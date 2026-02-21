import apiClient from './client';
import type { Expert, ExpertsResponse } from '../types';

interface GetExpertsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const getExperts = async (params: GetExpertsParams): Promise<ExpertsResponse> => {
  const { data } = await apiClient.get<ExpertsResponse>('/experts', { params });
  return data;
};

export const getExpertById = async (id: string): Promise<Expert> => {
  const { data } = await apiClient.get<Expert>(`/experts/${id}`);
  return data;
};
