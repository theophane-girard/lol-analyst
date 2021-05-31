import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display "Liste des parties au format csv"', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Liste des parties au format csv');
  });
});
