import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import ActionsCell from './ActionsCell'; 

export type Diamond = {
  diamondId: string;
  measurement: {
    measurementId: number;
    length: number;
    width: number;
    height: number;
  };
  carat: {
    caratId: number;
    carat: number;
  };
  color: {
    colorId: number;
    colorDescription: string;
  };
  cut: {
    cutId: number;
    cutDescription: string;
  };
  clarity: {
    clarityId: number;
    clarityDescription: string;
  };
  gia: {
    giaId: number;
    issueDate: string;
    giaNumber: string;
  };
  price: number;
  img: string;
  sold: boolean;
};

export const DiamondTable: ColumnDef<Diamond>[] = [
  {
    accessorKey: 'measurement',
    header: 'Measurement',
    cell: info => `${info.row.original.measurement.length} x ${info.row.original.measurement.width} x ${info.row.original.measurement.height}`,
  },
  {
    accessorKey: 'carat.carat',
    header: 'Carat',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'color.colorDescription',
    header: 'Color',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'cut.cutDescription',
    header: 'Cut Style',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'clarity.clarityDescription',
    header: 'Clarity',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'gia.giaNumber',
    header: 'GIA Number',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: info => `$${info.getValue()}`,
  },
  {
    accessorKey: 'img',
    header: 'Image',
    cell: ({ getValue }) => {
      const imageUrl = getValue() as string; // Type assertion to string
      return (
        <Image src={imageUrl} alt="Diamond" width={100} height={100} className="w-auto h-auto" priority={true}/>
      );
    }
  },
  {
    accessorKey: 'sold',
    header: "Status",
    cell: info => `${info.getValue()? "Sold" : "Available"}`,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell diamond={row.original} />, // Use the new component
  },
];
