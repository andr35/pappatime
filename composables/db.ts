import { useGeojsonData } from "./states";

export const useDb = async () => {
  const toast = useToast();
  const geojsonData = useGeojsonData();

  async function loadData() {
    const { data, error } = await useFetch("/api/geojson");
    // const { data, error } = await useFetch("/geojson.json");

    geojsonData.value = data.value as any;

    return { error };
  }

  let fetchError = null;
  if (!geojsonData.value) {
    const { error } = await loadData();
    fetchError = error;

    if (fetchError.value) {
      toast.add({
        id: "fetch_data_error",
        title: "Fetch Data Error",
        description: "Fail to fetch map data!",
        color: "red",
        closeButton: {},
      });
    }
  }

  return {
    geojsonData,
    fetchError,
  };
};
