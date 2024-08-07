import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FormUpdateDiamond from "./updateDiamond";
import { Diamond } from './diamondTable';
import { setDiamondStatus } from '@/dbUtils/diamondAPI/types';

type ActionsCellProps = {
  diamond: Diamond;
};

const ActionsCell: React.FC<ActionsCellProps> = ({ diamond }) => {
  const [showUpdateOverlay, setShowUpdateOverlay] = useState(false);

  const handleSetStatus = async (diamondId: string, status: boolean) => {
    await setDiamondStatus(diamondId, !status);
    window.location.reload(); 
  };

  const handleUpdateClick = () => {
    setShowUpdateOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowUpdateOverlay(false);
  };


  return (
    <>
      {showUpdateOverlay && (
        <FormUpdateDiamond diamondId={diamond.diamondId} onClose={handleCloseOverlay} />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleUpdateClick}>
            Cập nhật
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSetStatus(diamond.diamondId, diamond.sold)}>
            {diamond.sold ? 'Đặt Còn hàng' : 'Đặt Đã bán'}  
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;
