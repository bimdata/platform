function isPartOfTheOrga(userOrganizations, currentOrganization) {
  return Boolean(
    userOrganizations.find(orga => orga.id === currentOrganization.id)
  );
}

export { isPartOfTheOrga };
