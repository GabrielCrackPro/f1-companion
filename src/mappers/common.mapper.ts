export const commonMapper = (data: any) => {
  const { MRData } = data;
  return {
    series: MRData.series,
    url: MRData.url,
    pagination: {
      limit: MRData.limit,
      offset: MRData.offset,
      total: MRData.total,
    },
  };
};
