import SuggestiveSearch from "@vendly/ui/components/suggestive-search";

export default function Search() {
  return (
    <div className="w-full flex items-center">
      <div className="w-full max-w-xl">
        <SuggestiveSearch
          suggestions={[
            "Search your favourite movie",
            "Search user from connection",
            "Find trending topics",
          ]}
          effect="typewriter"
        />
      </div>
    </div>
  );
}
