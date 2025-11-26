import { FavoritePeakList } from '@/domain/favoritePeaks';

function FavoritePeaksPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="border-b pb-4">
        <h1 className="text-primary text-3xl font-bold tracking-tight">Meus Favoritos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus picos de surf favoritos e acesse rapidamente as previsões.
        </p>
      </header>

      <section>
        <FavoritePeakList />
      </section>
    </div>
  );
}

export { FavoritePeaksPage };
