import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

export default function Places({ setPlace, setZoom }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data, loading },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val) => {
    setValue(val, false);
    clearSuggestions();

    setZoom(18);

    const results = await getGeocode({ address: val });

    const { lat, lng } = await getLatLng(results[0]);
    setPlace({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input bg-white border-0 m-0 px-4 mt-20 lg:mt-3 relative select-none overflow-hidden h-10 text-black text-lg shadow xl:min-w-80 font-medium outline-none rounded-sm"
        placeholder="Search for farm address"
      />
      {loading ? (
        <div className="flex justify-center items-center h-24 bg-white shadow-lg mt-1 rounded-sm">
          <ButtonSpinner />
        </div>
      ) : (
        <ComboboxPopover className="bg-white shadow-lg mt-1 rounded-lg overflow-hidden">
          <ComboboxList className="max-h-60 overflow-auto text-base leading-6">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption
                  key={place_id}
                  value={description}
                  className="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:!bg-primary-ultra-light"
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  );
}
