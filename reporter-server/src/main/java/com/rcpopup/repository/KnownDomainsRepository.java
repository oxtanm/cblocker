package com.rcpopup.repository;

import com.rcpopup.model.KnownDomain;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface KnownDomainsRepository extends CrudRepository<KnownDomain, Long> {
    List<KnownDomain> findByDomain(String domain);
}
