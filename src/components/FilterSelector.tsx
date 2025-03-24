import { useState } from "react";

interface FilterSelectorProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

const filters = [
  { id: "", name: "Normal", class: "" },
  { id: "filter-1977", name: "1977", class: "filter-1977" },
  { id: "filter-aden", name: "Aden", class: "filter-aden" },
  { id: "filter-amaro", name: "Amaro", class: "filter-amaro" },
  { id: "filter-ashby", name: "Ashby", class: "filter-ashby" },
  { id: "filter-brannan", name: "Brannan", class: "filter-brannan" },
  { id: "filter-brooklyn", name: "Brooklyn", class: "filter-brooklyn" },
  { id: "filter-charmes", name: "Charmes", class: "filter-charmes" },
  { id: "filter-clarendon", name: "Clarendon", class: "filter-clarendon" },
  { id: "filter-crema", name: "Crema", class: "filter-crema" },
  { id: "filter-dogpatch", name: "Dogpatch", class: "filter-dogpatch" },
  { id: "filter-earlybird", name: "Earlybird", class: "filter-earlybird" },
  { id: "filter-gingham", name: "Gingham", class: "filter-gingham" },
  { id: "filter-ginza", name: "Ginza", class: "filter-ginza" },
  { id: "filter-hefe", name: "Hefe", class: "filter-hefe" },
  { id: "filter-helena", name: "Helena", class: "filter-helena" },
  { id: "filter-hudson", name: "Hudson", class: "filter-hudson" },
  { id: "filter-inkwell", name: "Inkwell", class: "filter-inkwell" },
  { id: "filter-kelvin", name: "Kelvin", class: "filter-kelvin" },
  { id: "filter-juno", name: "Juno", class: "filter-juno" },
];

export default function FilterSelector({
  selectedFilter,
  onSelectFilter,
}: FilterSelectorProps) {
  const [previewImage] = useState(
    "https://picturepan2.github.io/instagram.css/assets/img/instagram.jpg"
  ); // Ganti sesuai path gambar

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Choose a Filter</h3>

      <div className="grid grid-cols-4 gap-3 filter-grid">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className={`cursor-pointer flex flex-col items-center ${
              selectedFilter === filter.class ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectFilter(filter.class)}
          >
            <div
              className={`w-full aspect-square overflow-hidden rounded-md mb-1 ${filter.class}`}
            >
              <img
                src={previewImage}
                alt={filter.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs">{filter.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
