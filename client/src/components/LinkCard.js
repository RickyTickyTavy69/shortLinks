export const LinkCard = ({ link }) => {
  return (
    // "noopener norefferer" - чтобы реакт корректно работал с ссылками.
    <>
      <h2>Link</h2>

      <p>
        Your Link:
        <a href={link.to} target="_blank" rel="noopener noreferrer">
          {link.to}
        </a>
      </p>
      <p>
        From where:
        <a href={link.from} target="_blank" rel="noopener noreferrer">
          {link.from}
        </a>
      </p>
      <p>
        Clicks counter:
        <strong>{link.clicks}</strong>
      </p>
      <p>
        Creation Date:
        <strong> {new Date(link.date).toLocaleDateString()}</strong>
      </p>
    </>
  );
};
