import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GET_ORGANIZATION_COUNT, FILTER_ORGANIZATIONS } from 'graphql/queries/Organization';
import { DELETE_INACTIVE_ORGANIZATIONS } from 'graphql/mutations/Organization';
import { ReactComponent as OrganisationIcon } from 'assets/images/icons/Organisation.svg';
import { ReactComponent as UploadIcon } from 'assets/images/icons/Upload/Dark.svg';

import { setVariables } from 'common/constants';
import { List } from 'containers/List/List';
import styles from './ContactManagement.module.css';
import UploadContactsDialog from './UploadContactsDialog/UploadContactsDialog';

export interface ContactManagementProps {
  match: any;
}

const queries = {
  countQuery: GET_ORGANIZATION_COUNT,
  filterItemsQuery: FILTER_ORGANIZATIONS,
  deleteItemQuery: DELETE_INACTIVE_ORGANIZATIONS,
};

export const ContactManagement: React.SFC<ContactManagementProps> = () => {
  const { t } = useTranslation();
  //   const client = useApolloClient();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [organizationDetails, setOrganizationDetails] = useState({});

  let dialog;

  if (showUploadDialog) {
    dialog = (
      <UploadContactsDialog
        organizationDetails={organizationDetails}
        setDialog={setShowUploadDialog}
      />
    );
  }

  const columnNames = ['NAME', 'ACTIONS'];

  const getName = (label: string) => (
    <div className={styles.LabelContainer}>
      <p className={styles.LabelText}>{label}</p>
    </div>
  );

  const columnStyles: any = [styles.Label, styles.Actions];

  const getColumns = ({ name }: any) => ({
    name: getName(name),
  });

  const columnAttributes = {
    columnNames,
    columns: getColumns,
    columnStyles,
  };

  const listIcon = <OrganisationIcon className={styles.OrgIcon} />;
  const extensionIcon = <UploadIcon className={styles.UploadIcon} />;

  const uploadContacts = (_: any, details: any) => {
    setOrganizationDetails(details);
    setShowUploadDialog(true);
  };

  const dialogMessage = "Don't delete";

  const restrictedAction = () => ({ delete: false, edit: false });

  const additionalActions = [
    {
      icon: extensionIcon,
      parameter: 'id',
      label: t('Upload contacts'),
      dialog: uploadContacts,
    },
  ];
  const addNewButton = { show: false, label: 'Add New' };

  return (
    <>
      {dialog}
      <List
        title={t('Organizations')}
        listItem="organizations"
        listItemName="organization"
        pageLink="organization"
        listIcon={listIcon}
        dialogMessage={dialogMessage}
        restrictedAction={restrictedAction}
        refetchQueries={{
          query: FILTER_ORGANIZATIONS,
          variables: setVariables(),
        }}
        additionalAction={additionalActions}
        button={addNewButton}
        searchParameter="name"
        editSupport={false}
        {...queries}
        {...columnAttributes}
      />
    </>
  );
};

export default ContactManagement;
