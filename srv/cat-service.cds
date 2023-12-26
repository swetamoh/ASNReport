using my.bookshop as my from '../db/data-model';

service CatalogService {
    entity GetASNHeaderList as projection on my.GetASNHeaderList;
    entity GetASNDetailList as projection on my.GetASNDetailList;
}
