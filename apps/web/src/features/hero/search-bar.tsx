import SuggestiveSearch from "@vendly/ui/components/suggestive-search";

export default function SearchBar() {
  return (
    <div className="w-full flex items-center">
      <div className="w-full max-w-xl">
        <SuggestiveSearch
          suggestions={[
            "Find products across all shops",
            "Discover your favorite shops",
            "Find trending products",
          ]}
          effect="typewriter"
        />
      </div>
    </div>
  );
}
