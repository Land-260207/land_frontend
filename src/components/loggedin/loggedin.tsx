const LOGGEDIN = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4">
      {localStorage.getItem('username')}
    </div>
  );
}

export default LOGGEDIN;