import React from "react";
import { Icon, Link } from "@chakra-ui/react";
import { Link as DOMLink } from "react-router-dom";
import { Tr, Td } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import AlertModal from "components/commons/AlertModal";

const MemberItem = ({ memberItem, handleDelete }) => {
  const [
    isDeleteMemberDialogOpen,
    setIsDeleteMemberDialogOpen,
  ] = React.useState(false);

  return (
    <>
      <Tr>
        <Td>{memberItem.siteNumber}</Td>
        <Td>{memberItem.firstName}</Td>
        <Td>{memberItem.email}</Td>
        <Td>
          <DOMLink to={`/admin/updateMember/${memberItem.id}`} color="teal.500">
            <Icon
              as={EditIcon}
              color="teal.500"
              _hover={{ color: "teal.300" }}
            />
          </DOMLink>
        </Td>
        <Td>
          <Link
            onClick={() => setIsDeleteMemberDialogOpen(true)}
            color="red.600"
            _hover={{ color: "red.300" }}
          >
            <Icon as={DeleteIcon} />
          </Link>
        </Td>
      </Tr>
      <AlertModal
        heading="Delete Member"
        isOpen={isDeleteMemberDialogOpen}
        setIsOpen={setIsDeleteMemberDialogOpen}
        callback={() => {
          handleDelete(memberItem);
          setIsDeleteMemberDialogOpen(false);
        }}
      />
    </>
  );
};

export default MemberItem;
